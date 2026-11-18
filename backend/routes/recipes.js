const express = require("express");
const router = express.Router();

const RecipeController = require("../Controller/recipes");
const { authZRecipe } = require("../middlewares/authorization");

router.get("/", RecipeController.getRecipes);
router.get("/my-recipes", RecipeController.getMyRecipe);
router.get("/:id", RecipeController.getRecipeById);

router.post("/", RecipeController.createRecipe);
router.put("/:id", authZRecipe, RecipeController.updateRecipe);
router.delete("/:id", authZRecipe, RecipeController.deleteRecipe);

module.exports = router;