import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { authApi } from "./apis/authApi";
import { userApi } from "./apis/userApi";
import { tourApi } from "./apis/tourApi";
import { bookingApi } from "./apis/bookingApi";
import { userReducer } from "./slices/userSlice";
import { reviewApi } from "./apis/reviewApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [tourApi.reducerPath]: tourApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authApi.middleware,
    userApi.middleware,
    tourApi.middleware,
    bookingApi.middleware,
    reviewApi.middleware,
  ],
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);
