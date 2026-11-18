require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const {
    sequelize,
    User,
    Recipe,
    SavedRecipe,
} = require("../models");
const { signToken } = require("../helpers/jwt");

describe("Saved Recipes", () => {
    let user;
    let otherUser;
    let token;
    let otherToken;
    let recipe;
    let savedRecipe;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await SavedRecipe.destroy({ where: {} });
        await Recipe.destroy({ where: {} });
        await User.destroy({ where: {} });

        user = await User.create({
            name: "Saved Owner",
            email: "saved.owner@example.com",
            password: "hashed-password",
            imageProfile: "",
        });

        otherUser = await User.create({
            name: "Saved Other",
            email: "saved.other@example.com",
            password: "hashed-password",
            imageProfile: "",
        });

        token = signToken({ id: user.id });
        otherToken = signToken({ id: otherUser.id });

        recipe = await Recipe.create({
            name: "Saved Pasta",
            description: "Test description",
            ingredients: "Pasta, garlic",
            instructions: "Cook and serve.",
            image: "https://example.com/pasta.jpg",
            category: "Pasta",
            UserId: otherUser.id,
        });

        savedRecipe = await SavedRecipe.create({
            UserId: user.id,
            RecipeId: recipe.id,
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("200 - get saved recipes", async () => {
        const response = await request(app)
            .get("/saved-recipes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].Recipe.name).toBe("Saved Pasta");
    });

    test("201 - save a recipe", async () => {
        const anotherRecipe = await Recipe.create({
            name: "Another Recipe",
            description: "Description",
            ingredients: "Rice",
            instructions: "Cook rice.",
            image: "https://example.com/rice.jpg",
            category: "Rice",
            UserId: otherUser.id,
        });

        const response = await request(app)
            .post("/saved-recipes")
            .set("Authorization", `Bearer ${token}`)
            .send({ RecipeId: anotherRecipe.id });

        expect(response.status).toBe(201);
        expect(response.body.UserId).toBe(user.id);
        expect(response.body.RecipeId).toBe(anotherRecipe.id);
    });

    test("400 - save a recipe without RecipeId", async () => {
        const response = await request(app)
            .post("/saved-recipes")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("RecipeId is required");
    });

    test("400 - save a recipe that has already been saved", async () => {
        const response = await request(app)
            .post("/saved-recipes")
            .set("Authorization", `Bearer ${token}`)
            .send({ RecipeId: recipe.id });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Recipe has already been saved"
        );
    });

    test("200 - unsave own saved recipe", async () => {
        const response = await request(app)
            .delete(`/saved-recipes/${savedRecipe.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
            "Saved recipe deleted successfully"
        );
    });

    test("401 - another user cannot unsave someone else's saved recipe", async () => {
        const response = await request(app)
            .delete(`/saved-recipes/${savedRecipe.id}`)
            .set("Authorization", `Bearer ${otherToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "You are not authorized to perform this action"
        );
    });

    test("404 - unsave a saved recipe that does not exist", async () => {
        const response = await request(app)
            .delete("/saved-recipes/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Saved recipe not found");
    });
});
