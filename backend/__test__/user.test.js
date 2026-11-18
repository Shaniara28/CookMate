
const request = require("supertest");
const app = require("../app");
const { sequelize, User, Recipe, SavedRecipe } = require("../models");
const { signToken } = require("../helpers/jwt");

describe("User Profile", () => {
    let user;
    let token;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await SavedRecipe.destroy({ where: {} });
        await Recipe.destroy({ where: {} });
        await User.destroy({ where: {} });

        user = await User.create({
            name: "Profile Test",
            email: "profile.test@example.com",
            password: "hashed-password",
            imageProfile: "https://example.com/profile.jpg",
        });

        token = signToken({ id: user.id });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("200 - get current user profile", async () => {
        const response = await request(app)
            .get("/user/me")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(user.id);
        expect(response.body.name).toBe(user.name);
        expect(response.body.email).toBe(user.email);
        expect(response.body.imageProfile).toBe(user.imageProfile);
        expect(response.body).not.toHaveProperty("password");
    });

    test("401 - get profile without token", async () => {
        const response = await request(app).get("/user/me");

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Please login first");
    });

    test("200 - update current user profile", async () => {
        const response = await request(app)
            .put("/user/me")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Profile",
                imageProfile: "https://example.com/new-profile.jpg",
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Profile");
        expect(response.body.imageProfile).toBe(
            "https://example.com/new-profile.jpg"
        );
    });

    test("400 - update profile without name", async () => {
        const response = await request(app)
            .put("/user/me")
            .set("Authorization", `Bearer ${token}`)
            .send({
                imageProfile: "https://example.com/new-profile.jpg",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Name is required");
    });
});
