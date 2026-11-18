import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../constant/baseUrl";

const initialState = {
    user: null,
    error: "",
    registerSuccess: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        // Login
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.error = "";
        },

        loginFailed: (state, action) => {
            state.error = action.payload;
        },

        // Logout
        logout: (state) => {
            state.user = null;
            state.error = "";
            localStorage.removeItem("access_token");
        },

        // Register
        registerSuccess: (state) => {
            state.loading = false;
            state.error = "";
            state.registerSuccess = true;
        },

        registerFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.registerSuccess = false;
        },

        // Get current user
        getCurrentUserPending: (state) => {
            state.loading = true;
            state.error = "";
        },

        getCurrentUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },

        getCurrentUserFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        updateProfilePending: (state) => {
            state.loading = true;
            state.error = "";
        },

        // Update Profile
        updateProfileSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = "";
        },

        updateProfileFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

// Login biasa
export const loginAsync = (email, password) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${baseUrl}/login`, { email, password });

        localStorage.setItem("access_token", data.access_token);

        dispatch(loginSuccess(true));
    } catch (error) {
        dispatch(
            loginFailed(
                error.response?.data?.message ||
                "Email or password is incorrect"
            )
        );
    }
};

// Login google
export const googleLoginAsync =
    (credential) => async (dispatch) => {
        try {
            const { data } = await axios.post(`${baseUrl}/google-login`, {}, {
                headers: {
                    token: credential,
                },
            });

            localStorage.setItem("access_token", data.access_token);

            dispatch(loginSuccess(true));
        } catch (error) {
            dispatch(
                loginFailed(
                    error.response?.data?.message ||
                    "Google login failed"
                )
            );
        }
    };

// Register
export const registerAsync =
    (name, email, password, imageProfile) => async (dispatch) => {
        try {
            const { data } = await axios.post(`${baseUrl}/register`, {
                name,
                email,
                password,
                imageProfile
            });

            dispatch(registerSuccess(false));

            return {
                success: true,
                message: data.message || "Register success",
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed";

            dispatch(registerFailed(message));

            return {
                success: false,
                message,
            };
        }
    };

// Get current user
export const getCurrentUserAsync = () => {
    return async (dispatch) => {
        try {
            dispatch(getCurrentUserPending());

            const token =
                localStorage.getItem("access_token");

            const { data } = await axios.get(`${baseUrl}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(getCurrentUserSuccess(data));

        } catch (error) {
            dispatch(
                getCurrentUserFailed(
                    error.response?.data?.message ||
                    "Failed to get user profile"
                )
            );
        }
    };
};

// Update profile
export const updateProfileAsync = (name, imageProfile) => {
    return async (dispatch) => {
        try {
            dispatch(updateProfilePending());

            const token =
                localStorage.getItem("access_token");

            const { data } = await axios.put(`${baseUrl}/user/me`,
                {
                    name,
                    imageProfile,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            dispatch(updateProfileSuccess(data));

            return {
                success: true,
                data,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to update profile";

            dispatch(updateProfileFailed(message));

            return {
                success: false,
                message,
            };
        }
    };
};

export const {
    loginSuccess,
    loginFailed,
    logout,

    registerSuccess,
    registerFailed,

    getCurrentUserFailed,
    getCurrentUserPending,
    getCurrentUserSuccess,

    updateProfilePending,
    updateProfileSuccess,
    updateProfileFailed,
} = authSlice.actions;

export default authSlice.reducer;