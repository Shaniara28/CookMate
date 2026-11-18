const express = require("express");
const router = express.Router();
const RecipeController = require("../Controller/recipes");

router.get("/", RecipeController.getMyRecipe);

module.exports = router;