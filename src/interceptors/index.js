// axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";
import { setLogout } from "../redux/slices/signin-slice";
import store from "../redux/store/store";

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    
    /* const { url } = config || {};

    // Skip auth for interview-related endpoints
    if (url?.includes("get-language-for-interview") ||
        url?.includes("create-room-and-generate-token") ||
        url?.includes("get-all-questions") ||
        url?.includes("save-candidate-response") ||
        url?.includes("candidate-interview-status") ||
        url?.includes("common/user/fetch") ||
        url?.includes("common/user/save") ||
        url?.includes("common/otp/generate-otp") ||
        url?.includes("interview-link-validation")) {
      return config;
    } */

    const accessToken =
      localStorage.getItem("e_access_token") || Cookies.get("e_access_token");

    // Add the Authorization header if the access token is available
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle various error responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      store.dispatch(setLogout());
      window.location.href = "/signin";
      return Promise.reject({
        status: 401,
        message: "Session expired. Please login again.",
      });
    }

    // Handle 400 Bad Request errors with better error messages
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Bad request. Please check your input.";

      return Promise.reject({
        status: 400,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      return Promise.reject({
        status: 403,
        message:
          "Access forbidden. You don't have permission to perform this action.",
      });
    }

    // Handle 500 Internal Server errors
    if (error.response?.status === 500) {
      return Promise.reject({
        status: 500,
        message: "Internal server error. Please try again later.",
      });
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your internet connection.",
      });
    }

    // Handle other errors
    return Promise.reject({
      status: error.response?.status || 0,
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred.",
      data: error.response?.data,
    });
  }
);

export default axiosInstance;