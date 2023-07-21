import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, alertMsg: null, alertType: null },
  reducers: {
    getUser(state, { payload }) {
      state.user = payload;
    },
    isLoggedOut(state) {
      state.user = null;
    },
    setAlert(state, { payload }) {
      state.alertType = payload.type;
      state.alertMsg =
        payload.type === "error"
          ? payload.msg.data?.message || payload.msg.error
          : payload.msg;
    },
    clearAlert(state) {
      state.alertType = null;
      state.alertMsg = null;
    },
  },
});

export const { getUser, isLoggedOut, setAlert, clearAlert } = userSlice.actions;
export const userReducer = userSlice.reducer;
