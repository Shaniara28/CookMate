import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../constant/baseUrl";

const initialState = {
    savedRecipes: [],
    loading: false,
    error: "",
    saveLoading: false,
    unsaveLoading: false,
};

const savedSlice = createSlice({
    name: "savedRecipes",
    initialState,

    reducers: {
        // Get Saved Recipes
        fetchSavedPending: (state) => {
            state.loading = true;
            state.error = "";
        },

        fetchSavedSuccess: (state, action) => {
            state.loading = false;
            state.savedRecipes = action.payload;
            state.error = "";
        },

        fetchSavedFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Save Recipe
        savePending: (state) => {
            state.saveLoading = true;
            state.error = "";
        },

        saveSuccess: (state, action) => {
            state.saveLoading = false;
            state.savedRecipes.push(action.payload);
        },

        saveFailed: (state, action) => {
            state.saveLoading = false;
            state.error = action.payload;
        },

        // Unsave Recipe
        unsavePending: (state) => {
            state.unsaveLoading = true;
            state.error = "";
        },

        unsaveSuccess: (state, action) => {
            state.unsaveLoading = false;
            state.savedRecipes = state.savedRecipes.filter(
                (savedRecipe) =>
                    savedRecipe.id !== action.payload
            );
        },

        unsaveFailed: (state, action) => {
            state.unsaveLoading = false;
            state.error = action.payload;
        },
    },
});

// Get Saved Recipes
export const getSavedRecipesAsync = () => {
    return async (dispatch) => {
        try {
            dispatch(fetchSavedPending());

            const token = localStorage.getItem("access_token");

            const { data } = await axios.get(`${baseUrl}/saved-recipes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(fetchSavedSuccess(data));

        } catch (error) {
            if (error.response?.status === 404) {
                dispatch(fetchSavedSuccess([]));
                return;
            }

            dispatch(
                fetchSavedFailed(
                    error.response?.data?.message ||
                    "Failed to fetch saved recipes"
                )
            );
        }
    };
};

export const saveRecipeAsync = (recipeId) => {
    return async (dispatch) => {
        try {
            dispatch(savePending());

            const token =
                localStorage.getItem("access_token");

            const { data } = await axios.post(
                `${baseUrl}/saved-recipes`,
                {
                    RecipeId: recipeId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(saveSuccess(data));

            return {
                success: true,
                data,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to save recipe";

            dispatch(saveFailed(message));

            return {
                success: false,
                message,
            };
        }
    };
};

// Unsave Recipe
export const unsaveRecipeAsync = (savedRecipeId) => {
    return async (dispatch) => {
        try {
            dispatch(unsavePending());

            const token =
                localStorage.getItem("access_token");

            await axios.delete(`${baseUrl}/saved-recipes/${savedRecipeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            dispatch(unsaveSuccess(savedRecipeId));

            return {
                success: true,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to unsave recipe";

            dispatch(unsaveFailed(message));

            return {
                success: false,
                message,
            };
        }
    };
};

export const {
    fetchSavedPending,
    fetchSavedSuccess,
    fetchSavedFailed,

    savePending,
    saveSuccess,
    saveFailed,

    unsavePending,
    unsaveSuccess,
    unsaveFailed
} = savedSlice.actions;

export default savedSlice.reducer;