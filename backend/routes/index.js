
const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/authentication");

const authRouter = require("./auth");
const userRouter = require("./user");
const recipeRouter = require("./recipes");
const myRecipesRouter = require("./myRecipes");
const savedRecipesRouter = require("./savedRecipes");
const theMealDBRouter = require("./theMealDB");
const geminiRouter = require("./gemini");

// Public routes
router.use(authRouter);

// Authentication middleware
router.use(authentication);

// Protected routes
router.use("/user", userRouter);
router.use("/recipes", recipeRouter);
router.use("/my-recipes", myRecipesRouter);
router.use("/saved-recipes", savedRecipesRouter);
router.use("/external-recipes", theMealDBRouter);
router.use("/ai", geminiRouter);

module.exports = router;
