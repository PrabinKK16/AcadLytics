import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, thunkAPI) => {
    try {
      const response = await axiosInstance.patch("/profile", payload);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "profile/updateAvatar",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axiosInstance.patch("/profile/avatar", formData);

      return response.data.data.avatar;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Avatar update failed",
      );
    }
  },
);

export const removeAvatar = createAsyncThunk(
  "profile/removeAvatar",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete("/profile/avatar");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Remove avatar failed",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (payload, thunkAPI) => {
    try {
      await axiosInstance.patch("/profile/change-password", payload);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("profile/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export default profileSlice.reducer;
