const express = require("express");
const router = express.Router();

const SavedRecipesController = require("../Controller/savedRecipes");
const { authZSavedRecipe } = require("../middlewares/authorization");

router.get("/", SavedRecipesController.getSavedRecipes);
router.post("/", SavedRecipesController.createSavedRecipe);
router.delete("/:id", authZSavedRecipe, SavedRecipesController.deleteSavedRecipe);

module.exports = router;