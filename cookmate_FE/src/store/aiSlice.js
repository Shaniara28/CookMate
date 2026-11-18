import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../constant/baseUrl";

const getToken = () => {
    return localStorage.getItem("access_token");
};

export const getAIRecommendations = createAsyncThunk("ai/getRecommendations",
    async ({ ingredients, preferences }, { rejectWithValue }) => {
        try {
            const token = getToken();

            const { data } = await axios.post(`${baseUrl}/ai/recommend`,
                {
                    ingredients,
                    preferences,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to get AI recommendations"
            );
        }
    }
);

const initialState = {
    recommendations: [],
    loading: false,
    error: null,
};

const aiSlice = createSlice({
    name: "ai",
    initialState,

    reducers: {
        clearRecommendations: (state) => {
            state.recommendations = [];
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(
                getAIRecommendations.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAIRecommendations.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.recommendations =
                        action.payload.recommendations;
                }
            )

            .addCase(
                getAIRecommendations.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error = action.payload;
                }
            );
    },
});

export const { clearRecommendations, } = aiSlice.actions;

export default aiSlice.reducer;