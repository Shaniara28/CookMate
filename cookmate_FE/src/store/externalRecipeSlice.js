import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../constant/baseUrl";

const getToken = () => {
    return localStorage.getItem("access_token");
};

// Search recipes
export const searchExternalRecipes = createAsyncThunk("externalRecipe/search",
    async (query, { rejectWithValue }) => {
        try {
            const token = getToken();

            const { data } = await axios.get(`${baseUrl}/external-recipes/search`,
                {
                    params: {
                        query
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to search recipes"
            );
        }
    }
);


// Get recipe detail
export const getExternalRecipeDetail = createAsyncThunk("externalRecipe/detail",
    async (id, { rejectWithValue }) => {
        try {
            const token = getToken();

            const { data } = await axios.get(`${baseUrl}/external-recipes/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get recipe detail"
            );
        }
    }
);

// Get categories
export const getExternalCategories = createAsyncThunk("externalRecipe/categories",
    async (_, { rejectWithValue }) => {
        try {
            const token = getToken();

            const { data } = await axios.get(`${baseUrl}/external-recipes/categories`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get categories"
            );
        }
    }
);

// Filter recipes
export const filterExternalRecipes = createAsyncThunk("externalRecipe/filter",
    async ({ type, value }, { rejectWithValue }) => {
        try {
            const token = getToken();

            const { data } = await axios.get(`${baseUrl}/external-recipes/filter`,
                {
                    params: {
                        type,
                        value
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return data;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to filter recipes"
            );
        }
    }
);

const initialState = {
    recipes: [],
    recipeDetail: null,
    categories: [],
    loading: false,
    error: null
};

const externalRecipeSlice = createSlice({
    name: "externalRecipe",
    initialState,

    reducers: {
        clearRecipeDetail: (state) => {
            state.recipeDetail = null;
        },

        clearRecipes: (state) => {
            state.recipes = [];
        }
    },

    extraReducers: (builder) => {
        builder
            // SEARCH
            .addCase(searchExternalRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(searchExternalRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload;
            })

            .addCase(searchExternalRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DETAIL
            .addCase(getExternalRecipeDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getExternalRecipeDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.recipeDetail = action.payload;
            })

            .addCase(getExternalRecipeDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CATEGORY
            .addCase(getExternalCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getExternalCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })

            .addCase(getExternalCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // FILTER
            .addCase(filterExternalRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(filterExternalRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload;
            })

            .addCase(filterExternalRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearRecipeDetail, clearRecipes } = externalRecipeSlice.actions;

export default externalRecipeSlice.reducer;