import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
    clearAuth: (state) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    }
  },
});

// Export both actions: authenticate and clearAuth
export const { authenticate, clearAuth } = authSlice.actions;

export default authSlice.reducer;
