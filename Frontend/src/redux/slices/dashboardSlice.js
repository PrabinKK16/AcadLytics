import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const fetchFacultyTrend = createAsyncThunk(
  "dashboard/fetchFacultyTrend",
  async (facultyId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/analytics/faculty/${facultyId}/trend`,
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch trend",
      );
    }
  },
);

export const fetchCourseAnalytics = createAsyncThunk(
  "dashboard/fetchCourseAnalytics",
  async (courseId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/analytics/course/${courseId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics",
      );
    }
  },
);

export const fetchNotifications = createAsyncThunk(
  "dashboard/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notifications");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const fetchUnreadCount = createAsyncThunk(
  "dashboard/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notifications/unread-count");
      return response.data.data.count;
    } catch {
      return thunkAPI.rejectWithValue(0);
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "dashboard/markNotificationRead",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${id}/read`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark read",
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "dashboard/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete notification",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    facultyTrend: [],
    courseAnalytics: null,
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacultyTrend.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFacultyTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.facultyTrend = action.payload;
      })
      .addCase(fetchFacultyTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCourseAnalytics.fulfilled, (state, action) => {
        state.courseAnalytics = action.payload;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications || [];
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (item) => item._id !== action.payload,
        );
      });
  },
});

export default dashboardSlice.reducer;
