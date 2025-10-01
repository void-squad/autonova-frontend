import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { login, signup } from "../../Api/authApi";
import type { LoginCredentials, LoginResponse, SignupCredentials, SignupResponse } from "../../Api/authApi";
import type { RootState } from "../store";

interface AuthState {
    token: string | null;
    user: LoginResponse["user"] | null;
    loading: boolean;
    error: string | null;
}

// Guard against environments where window/localStorage are unavailable
const safeGetToken = (): string | null => {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem("token");
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    token: safeGetToken(),
    user: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk<
    LoginResponse,
    LoginCredentials,
    { rejectValue: string }
>(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await login(credentials);
            if (credentials.remember) {
                try {
                    localStorage.setItem("token", data.token);
                } catch {
                    /* ignore quota / privacy mode errors */
                }
            }
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message =
                    (err.response?.data as any)?.message ||
                    err.response?.statusText ||
                    err.message ||
                    "Login failed";
                return rejectWithValue(message);
            }
            return rejectWithValue("Unexpected error during login");
        }
    }
);

export const signupUser = createAsyncThunk<
    SignupResponse,
    SignupCredentials,
    { rejectValue: string }
>(
    "auth/signupUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await signup(credentials);
            try {
                localStorage.setItem("token", data.token);
            } catch { /* ignore */ }
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message =
                    (err.response?.data as any)?.message ||
                    err.response?.statusText ||
                    err.message ||
                    "Signup failed";
                return rejectWithValue(message);
            }
            return rejectWithValue("Unexpected error during signup");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            try {
                localStorage.removeItem("token");
            } catch {
                /* ignore */
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                loginUser.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.loading = false;
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                }
            )
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            // Signup cases
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action: PayloadAction<SignupResponse>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Signup failed";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors (small helpers for components)
export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoadingOrError = (state: RootState) => ({ loading: state.auth.loading, error: state.auth.error });
