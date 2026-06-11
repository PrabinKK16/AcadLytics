import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
};

const SKIP_REFRESH_URLS = [
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/login",
  "/auth/signup",
  "/auth/verify-otp",
];

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const shouldSkip = SKIP_REFRESH_URLS.some((url) =>
      requestUrl.includes(url),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkip
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");

        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);

        const { store } = await import("../redux/store");
        const { logoutUser } = await import("../redux/slices/authSlice");
        store.dispatch(logoutUser());

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
