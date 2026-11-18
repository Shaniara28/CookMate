require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express()

const AuthController = require('./Controller/auth')
const RecipeController = require('./Controller/recipes')
const authentication = require('./middlewares/authentication')
const { authZRecipe, authZSavedRecipe } = require('./middlewares/authorization')
const SavedRecipesController = require('./Controller/savedRecipes')
const TheMealDBController = require('./Controller/theMealDB')
const errorHandler = require('./middlewares/errorHandler')
const GeminiController = require('./Controller/gemini')
const UserController = require('./Controller/user')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Auth
app.post('/login', AuthController.login)
app.post('/google-login', AuthController.googleLogin)
app.post('/register', AuthController.register)

app.use(authentication);

// User
app.get("/user/me", UserController.getCurrentUser);
app.put("/user/me", UserController.updateCurrentUser);

// Recipe
app.get('/recipes', RecipeController.getRecipes)
app.get('/recipes/:id', RecipeController.getRecipeById)
app.get('/my-recipes', RecipeController.getMyRecipe)
app.post('/recipes', RecipeController.createRecipe)
app.put('/recipes/:id', authZRecipe, RecipeController.updateRecipe)
app.delete('/recipes/:id', authZRecipe, RecipeController.deleteRecipe)

// TheMealDB
app.get('/external-recipes/search', TheMealDBController.searchRecipes)
app.get('/external-recipes/categories', TheMealDBController.getCategories)
app.get('/external-recipes/filter', TheMealDBController.filterRecipes)
app.get('/external-recipes/:id', TheMealDBController.getRecipeById)

// AI
app.post('/ai/recommend', GeminiController.recommendRecipes)

// Saved Recipes
app.get('/saved-recipes', SavedRecipesController.getSavedRecipes)
app.post('/saved-recipes', SavedRecipesController.createSavedRecipe)
app.delete('/saved-recipes/:id', authZSavedRecipe, SavedRecipesController.deleteSavedRecipe)

// Error Handler
app.use(errorHandler)

module.exports = app