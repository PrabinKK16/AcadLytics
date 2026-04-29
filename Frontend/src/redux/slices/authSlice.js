import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      return { email: formData.email, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", formData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "OTP verification failed",
      );
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/auth/verify-email?token=${token}`,
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Email verification failed",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reset email",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password?token=${token}`,
        { password },
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password reset failed",
      );
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(null);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.post("/auth/logout");
      return null;
    } catch (error) {
      return null;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    pendingEmail: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.payload.email;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.pendingEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.pendingEmail = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
