
const request = require("supertest");
const app = require("../app");
const { sequelize, User, Recipe, SavedRecipe } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");

describe("Authentication", () => {
    const userData = {
        name: "CookMate Test",
        email: "auth.test@example.com",
        password: "secret123",
        imageProfile: "",
    };

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        await SavedRecipe.destroy({ where: {} });
        await Recipe.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("201 - register successfully", async () => {
        const response = await request(app)
            .post("/register")
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe(
            "User registered successfully"
        );
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user.email).toBe(userData.email);
        expect(response.body.user).not.toHaveProperty("password");
    });

    test("400 - register when required fields are missing", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                name: userData.name,
                email: userData.email,
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Name, email, and password are required"
        );
    });

    test("400 - register with invalid email", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                ...userData,
                email: "invalid-email",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid email format");
    });

    test("400 - register with password shorter than 5 characters", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                ...userData,
                password: "1234",
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Password must be at least 5 characters long"
        );
    });

    test("400 - register with an existing email", async () => {
        await User.create({
            ...userData,
            password: hashPassword(userData.password),
        });

        const response = await request(app)
            .post("/register")
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Email already exists");
    });

    test("200 - login successfully", async () => {
        await User.create({
            ...userData,
            password: hashPassword(userData.password),
        });

        const response = await request(app)
            .post("/login")
            .send({
                email: userData.email,
                password: userData.password,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
    });

    test("400 - login when email or password is missing", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: userData.email });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Email and password are required"
        );
    });

    test("401 - login with wrong password", async () => {
        await User.create({
            ...userData,
            password: hashPassword(userData.password),
        });

        const response = await request(app)
            .post("/login")
            .send({
                email: userData.email,
                password: "wrongpass",
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe(
            "Invalid email or password"
        );
    });
});
