import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../constant/baseUrl";

export const recipeSlice = createSlice({
    name: "recipes",

    initialState: {
        recipes: [],
        loading: false,
        error: "",

        detailRecipe: null,
        detailLoading: false,
        detailError: "",

        addSuccess: false,
        addError: "",

        myRecipes: [],
        myRecipeLoading: false,
        myRecipeError: "",

        updateLoading: false,
        updateSuccess: false,
        updateError: "",

        deleteSuccess: false,
        deleteError: "",
    },

    reducers: {
        // Get all recipe
        fetchPending: (state) => {
            state.loading = true;
            state.error = "";
        },

        fetchSuccess: (state, action) => {
            state.loading = false;
            state.recipes = action.payload;
        },

        fetchFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Get detail recipe
        fetchDetailPending: (state) => {
            state.detailLoading = true;
            state.detailError = "";
        },

        fetchDetailSuccess: (state, action) => {
            state.detailLoading = false;
            state.detailRecipe = action.payload;
        },

        fetchDetailFailed: (state, action) => {
            state.detailLoading = false;
            state.detailError = action.payload;
        },

        // Add Recipe
        addRecipeSuccess: (state, action) => {
            state.addSuccess = true;
            state.addError = "";

            state.recipes.push(action.payload);
        },

        addRecipeFailed: (state, action) => {
            state.addSuccess = false;
            state.addError = action.payload;
        },

        // Get my recipe
        myRecipePending: (state) => {
            state.myRecipeLoading = true;
            state.myRecipeError = "";
        },

        myRecipeSuccess: (state, action) => {
            state.myRecipeLoading = false;
            state.myRecipes = action.payload;
        },

        myRecipeFailed: (state, action) => {
            state.myRecipeLoading = false;
            state.myRecipeError = action.payload;
        },

        // Update Recipe
        updateRecipePending: (state) => {
            state.updateLoading = true;
            state.updateSuccess = false;
            state.updateError = "";
        },

        updateRecipeSuccess: (state, action) => {
            state.updateLoading = false;
            state.updateSuccess = true;
            state.updateError = "";

            const index = state.recipes.findIndex(
                (recipe) => recipe.id === action.payload.id
            );

            if (index !== -1) {
                state.recipes[index] = action.payload;
            }

            const myRecipeIndex = state.myRecipes.findIndex(
                (recipe) => recipe.id === action.payload.id
            );

            if (myRecipeIndex !== -1) {
                state.myRecipes[myRecipeIndex] = action.payload;
            }

            state.detailRecipe = action.payload;
        },

        updateRecipeFailed: (state, action) => {
            state.updateLoading = false;
            state.updateSuccess = false;
            state.updateError = action.payload;
        },

        // Delete Recipe
        deleteRecipeSuccess: (state, action) => {
            state.deleteLoading = false;
            state.deleteSuccess = true;
            state.deleteError = "";

            state.myRecipes = state.myRecipes.filter(
                (recipe) => recipe.id !== action.payload
            );
        },

        deleteRecipeFailed: (state, action) => {
            state.deleteLoading = false;
            state.deleteSuccess = false;
            state.deleteError = action.payload;
        },
    },
});

// Get all recipe
export const fetchAsync = () => {
    return async (dispatch) => {
        try {
            dispatch(fetchPending());

            const token = localStorage.getItem("access_token");

            const { data } = await axios.get(`${baseUrl}/recipes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(fetchSuccess(data));
        } catch (error) {
            if (error.response?.status === 404) {
                dispatch(fetchSuccess([]));
                return;
            }

            dispatch(
                fetchFailed(
                    error.response?.data?.message ||
                    "Failed to fetch recipes"
                )
            );
        }
    };
};

// Get detail recipe
export const fetchDetailAsync = (id) => {
    return async (dispatch) => {
        try {
            dispatch(fetchDetailPending());

            const token =
                localStorage.getItem("access_token");

            const { data } = await axios.get(`${baseUrl}/recipes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(fetchDetailSuccess(data));
        } catch (error) {
            dispatch(
                fetchDetailFailed(
                    error.response?.data?.message ||
                    "Failed to fetch recipe detail"
                )
            );
        }
    };
};

// Add Recipe
export const addRecipeAsync =
    (recipeData) => async (dispatch) => {

        try {
            const token = localStorage.getItem("access_token");

            const { data } = await axios.post(`${baseUrl}/recipes`, recipeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            dispatch(addRecipeSuccess(data));

            return {
                success: true,
                data,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to add recipe";

            dispatch(addRecipeFailed(message));

            return {
                success: false,
                message,
            };
        }
    };

// Update Recipe
export const updateRecipeAsync =
    (id, recipeData) => async (dispatch) => {

        try {
            dispatch(updateRecipePending());

            const token = localStorage.getItem("access_token");

            const { data } = await axios.put(`${baseUrl}/recipes/${id}`, recipeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(updateRecipeSuccess(data));

            return {
                success: true,
                data,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to update recipe";

            dispatch(updateRecipeFailed(message));

            return {
                success: false,
                message,
            };
        }
    };

// Delete Recipe
export const deleteRecipeAsync =
    (id) => async (dispatch) => {
        try {
            const token = localStorage.getItem("access_token");

            await axios.delete(`${baseUrl}/recipes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            dispatch(deleteRecipeSuccess(id));

            return {
                success: true,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to delete recipe";

            dispatch(deleteRecipeFailed(message));

            return {
                success: false,
                message,
            };
        }
    };

// Get my recipe
export const getMyRecipeAsync = () => {
    return async (dispatch) => {
        try {
            dispatch(myRecipePending());

            const token = localStorage.getItem("access_token");

            const { data } = await axios.get(`${baseUrl}/my-recipes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            dispatch(myRecipeSuccess(data));

        } catch (error) {

            if (error.response?.status === 404) {
                dispatch(myRecipeSuccess([]));
                return;
            }

            dispatch(myRecipeFailed(
                error.response?.data?.message ||
                "Failed to fetch your recipes"
            )
            );
        }
    };
};

export const {
    fetchPending,
    fetchSuccess,
    fetchFailed,

    fetchDetailPending,
    fetchDetailSuccess,
    fetchDetailFailed,

    addRecipeSuccess,
    addRecipeFailed,

    myRecipePending,
    myRecipeSuccess,
    myRecipeFailed,

    updateRecipePending,
    updateRecipeSuccess,
    updateRecipeFailed,

    deleteRecipeSuccess,
    deleteRecipeFailed
} = recipeSlice.actions;


export default recipeSlice.reducer;