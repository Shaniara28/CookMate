const express = require("express");
const router = express.Router();
const GeminiController = require("../Controller/gemini");

router.post("/recommend", GeminiController.recommendRecipes);

module.exports = router;