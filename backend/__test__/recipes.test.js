
require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const { sequelize, User, Recipe, SavedRecipe } = require("../models");
const { signToken } = require("../helpers/jwt");

describe("Recipes", () => {
    let user;
    let otherUser;
    let token;
    let otherToken;
    let recipe;

    const recipeData = {
        name: "Test Pasta",
        description: "A test recipe",
        ingredients: "Pasta, garlic, oil",
        instructions: "Boil pasta. Cook garlic. Mix together.",
        image: "https://example.com/pasta.jpg",
        category: "Pasta",
    };

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await SavedRecipe.destroy({ where: {} });
        await Recipe.destroy({ where: {} });
        await User.destroy({ where: {} });

        user = await User.create({
            name: "Recipe Owner",
            email: "recipe.owner@example.com",
            password: "hashed-password",
            imageProfile: "",
        });

        otherUser = await User.create({
            name: "Other User",
            email: "recipe.other@example.com",
            password: "hashed-password",
            imageProfile: "",
        });

        token = signToken({ id: user.id });
        otherToken = signToken({ id: otherUser.id });

        recipe = await Recipe.create({
            ...recipeData,
            UserId: user.id,
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("200 - get all recipes", async () => {
        const response = await request(app)
            .get("/recipes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(
            response.body.some((item) => item.id === recipe.id)
        ).toBe(true);
    });

    test("401 - get recipes without token", async () => {
        const response = await request(app).get("/recipes");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Please login first");
    });

    test("200 - get recipe by ID", async () => {
        const response = await request(app)
            .get(`/recipes/${recipe.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(recipe.id);
        expect(response.body.name).toBe(recipeData.name);
    });

    test("404 - get a recipe that does not exist", async () => {
        const response = await request(app)
            .get("/recipes/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Recipe not found");
    });

    test("200 - get my recipes", async () => {
        const response = await request(app)
            .get("/my-recipes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(
            response.body.every((item) => item.UserId === user.id)
        ).toBe(true);
    });

    test("201 - create a recipe", async () => {
        const response = await request(app)
            .post("/recipes")
            .set("Authorization", `Bearer ${token}`)
            .send(recipeData);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(recipeData.name);
        expect(response.body.UserId).toBe(user.id);
    });

    test("400 - create a recipe with missing fields", async () => {
        const response = await request(app)
            .post("/recipes")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Incomplete recipe" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("All fields are required");
    });

    test("200 - update own recipe", async () => {
        const response = await request(app)
            .put(`/recipes/${recipe.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                ...recipeData,
                name: "Updated Pasta",
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Pasta");
    });

    test("401 - another user cannot update recipe", async () => {
        const response = await request(app)
            .put(`/recipes/${recipe.id}`)
            .set("Authorization", `Bearer ${otherToken}`)
            .send({
                ...recipeData,
                name: "Unauthorized update",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "You are not authorized to perform this action"
        );
    });

    test("200 - delete own recipe", async () => {
        const response = await request(app)
            .delete(`/recipes/${recipe.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            `Recipe ${recipeData.name} deleted successfully`
        );
    });

    test("401 - another user cannot delete recipe", async () => {
        const response = await request(app)
            .delete(`/recipes/${recipe.id}`)
            .set("Authorization", `Bearer ${otherToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "You are not authorized to perform this action"
        );
    });
});
