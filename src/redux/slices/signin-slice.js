import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  currentUser: "" || localStorage.getItem("currentUser"),
  accessToken: null || localStorage.getItem("e_access_token"),
  tncStatus: null || localStorage.getItem("tncStatus"),
  userId: null || localStorage.getItem("userId"),
  userType: null || localStorage.getItem("userType"),
  isLogout: false,
};

const signinSlice = createSlice({
  name: "signinSlice",
  initialState,
  reducers: {
    setUserState: (state, action) => {
      const userType = (action.payload.userType || "").toLowerCase();
      state.currentUser = action.payload.userName;
      state.userType = userType;
      state.tncStatus = action.payload.tncStatus;
      state.userId = action.payload.userId;
      state.accessToken = action.payload.token;
      state.isLogout = false;

      // Update localStorage with all user data
      localStorage.setItem("currentUser", action.payload.userName);
      localStorage.setItem("tncStatus", action.payload.tncStatus);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userType", userType);
      localStorage.setItem("e_access_token", action.payload.token);
      
      // Also set cookie for cross-tab persistence
      Cookies.set("e_access_token", action.payload.token, { expires: 1 });
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", action.payload);
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("e_access_token", action.payload);
      Cookies.set("e_access_token", action.payload, { expires: 1 });
    },
    setTnCStatus: (state, action) => {
      state.userId = action.payload.userId;
      state.tncStatus = action.payload.tncStatus;
      localStorage.setItem("tncStatus", action.payload.tncStatus);
      localStorage.setItem("userId", action.payload.userId);
      
      // Ensure we have the latest token when updating TNC status
      const currentToken = localStorage.getItem("e_access_token") || Cookies.get("e_access_token");
      if (currentToken) {
        state.accessToken = currentToken;
      }
    },
    setLogout: (state, action) => {
      // Clear all stored data
      Cookies.remove("e_access_token");
      localStorage.clear();
      
      // Reset state
      state.userType = "";
      state.accessToken = null;
      state.currentUser = "";
      state.tncStatus = null;
      state.userId = null;
      state.isLogout = true;
    },
    resetLogoutFlag: (state, action) => {
      state.isLogout = false;
    },
    // New action to sync state with localStorage
    syncStateWithStorage: (state) => {
      const storedToken = localStorage.getItem("e_access_token") || Cookies.get("e_access_token");
      const storedUserId = localStorage.getItem("userId");
      const storedTncStatus = localStorage.getItem("tncStatus");
      const storedUserType = localStorage.getItem("userType");
      const storedCurrentUser = localStorage.getItem("currentUser");
      
      if (storedToken) state.accessToken = storedToken;
      if (storedUserId) state.userId = storedUserId;
      if (storedTncStatus !== null) state.tncStatus = storedTncStatus === "true";
      if (storedUserType) state.userType = storedUserType;
      if (storedCurrentUser) state.currentUser = storedCurrentUser;
    },
  },
});

export const {
  setCurrentUser,
  setAccessToken,
  setTnCStatus,
  setLogout,
  setUserState,
  resetLogoutFlag,
  setUserId,
  syncStateWithStorage,
} = signinSlice.actions;

const signinSliceReducer = signinSlice.reducer;
export default signinSliceReducer;
