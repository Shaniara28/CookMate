const express = require("express");
const router = express.Router();
const TheMealDBController = require("../Controller/theMealDB");

router.get("/search", TheMealDBController.searchRecipes);
router.get("/categories", TheMealDBController.getCategories);
router.get("/filter", TheMealDBController.filterRecipes);
router.get("/:id", TheMealDBController.getRecipeById);

module.exports = router;