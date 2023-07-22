import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "../customFetchBase";
import { bookingApi } from "./bookingApi";
import { userApi } from "./userApi";
import { tourApi } from "./tourApi";
import { isLoggedOut } from "../slices/userSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    //* Signup *****************************************************
    signup: builder.mutation({
      query: (formData) => ({
        url: "/auth/signup",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
          obj.dispatch(bookingApi.util.resetApiState());
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* Login ******************************************************
    login: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
          obj.dispatch(bookingApi.util.resetApiState());
          obj.dispatch(tourApi.util.invalidateTags(["tourReviews"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* Logout *****************************************************
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "PATCH",
        body: {},
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.resetApiState());
          obj.dispatch(isLoggedOut());
          obj.dispatch(tourApi.util.invalidateTags(["tourReviews"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* forgotPassword *********************************************
    forgotPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: formData,
      }),
    }),

    //* verifyResetCode ********************************************
    verifyResetCode: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password-code/verify",
        method: "POST",
        body: formData,
      }),
    }),

    //* resetPasswordUsingLink *************************************
    resetPasswordUsingLink: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password-link/reset",
        method: "PATCH",
        body: formData,
      }),
    }),

    //* resetPasswordUsingCode *************************************
    resetPasswordUsingCode: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password-code/reset",
        method: "PATCH",
        body: formData,
      }),
    }),

    //* Enable 2FA *************************************************
    enable2FA: builder.mutation({
      query: () => ({
        url: "/auth/enable2FA",
        method: "POST",
        body: {},
      }),
    }),

    //* Verify 2FA *************************************************
    verify2FA: builder.mutation({
      query: (token) => ({
        url: "/auth/verify2FA",
        method: "POST",
        body: { token },
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* Disable2FA *************************************************
    disable2FA: builder.mutation({
      query: () => ({
        url: "/auth/disable2FA",
        method: "POST",
        body: {},
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* Validate 2FA ***********************************************
    validate2FA: builder.mutation({
      query: (formData) => ({
        url: "/auth/validate2FA/authenticator",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
          obj.dispatch(bookingApi.util.resetApiState());
          obj.dispatch(tourApi.util.invalidateTags(["tourReviews"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),

    //* send2FACode ************************************************
    send2FACode: builder.mutation({
      query: (formData) => ({
        url: "/auth/sendCode2FA/email-or-phone",
        method: "POST",
        body: formData,
      }),
    }),

    //* validate2FAEmailOrPhone ************************************
    validate2FAEmailOrPhone: builder.mutation({
      query: (formData) => ({
        url: "/auth/validate2FA/email-or-phone",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        try {
          await obj.queryFulfilled;
          obj.dispatch(userApi.util.invalidateTags(["me"]));
          obj.dispatch(bookingApi.util.resetApiState());
          obj.dispatch(tourApi.util.invalidateTags(["tourReviews"]));
        } catch (error) {
          if (import.meta.env.DEV) console.error("Error:", error);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordUsingLinkMutation,
  useResetPasswordUsingCodeMutation,
  useEnable2FAMutation,
  useVerify2FAMutation,
  useDisable2FAMutation,
  useValidate2FAMutation,
  useSend2FACodeMutation,
  useValidate2FAEmailOrPhoneMutation,
} = authApi;
