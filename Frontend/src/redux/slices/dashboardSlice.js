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
  async (params = {}, thunkAPI) => {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await axiosInstance.get(
        `/notifications?page=${page}&limit=${limit}`,
      );
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

export const markAllNotificationsRead = createAsyncThunk(
  "dashboard/markAllNotificationsRead",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.patch("/notifications/read-all");
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read",
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

export const clearAllNotifications = createAsyncThunk(
  "dashboard/clearAllNotifications",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete("/notifications/clear-all");
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to clear notifications",
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
    notificationPagination: null,
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
        state.notificationPagination = action.payload.pagination || null;
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

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((item) => ({
          ...item,
          isRead: true,
        }));
        state.unreadCount = 0;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deleted = state.notifications.find(
          (item) => item._id === action.payload,
        );
        if (deleted && !deleted.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (item) => item._id !== action.payload,
        );
      })

      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  },
});

export default dashboardSlice.reducer;
