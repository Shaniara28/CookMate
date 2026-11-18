import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import recipeReducer from "./recipeSlice";
import savedReducer from "./savedSlice";
import externalRecipeReducer from "./externalRecipeSlice";
import aiReducer from "./aiSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipeReducer,
        savedRecipes: savedReducer,
        externalRecipe: externalRecipeReducer,
        ai: aiReducer,
    },
});

export default store;