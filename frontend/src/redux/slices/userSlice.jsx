import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    getUser(state, action) {
      state.user = action.payload;
    },
    isLoggedOut(state) {
      state.user = null;
    },
  },
});

export const { getUser, isLoggedOut } = userSlice.actions;
export const userReducer = userSlice.reducer;
