// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("elevateMart-userInfo"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "elevateMart-userInfo",
          JSON.stringify(action.payload)
        );
      }
    },

    setTemporaryCredentials: (state, action) => {
      state.userInfo = action.payload;
    },

    clearCredentials: (state) => {
      state.userInfo = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("elevateMart-userInfo");
      }
    },
  },
});

export const { setCredentials, setTemporaryCredentials, clearCredentials } =
  authSlice.actions;

export default authSlice.reducer;
