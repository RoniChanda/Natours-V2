import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "../customFetchBase";
import { getUser } from "../slices/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    //* Get me *****************************************************
    getMe: builder.query({
      providesTags: () => [{ type: "me" }],
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),

      async onQueryStarted(args, obj) {
        try {
          const { data } = await obj.queryFulfilled;
          obj.dispatch(getUser(data.data.user));
        } catch (error) {
          if (import.meta.env.DEV) console.log(error);
        }
      },
    }),

    //* Update me **************************************************
    updateMe: builder.mutation({
      invalidatesTags: () => [{ type: "me" }],
      query: (formData) => ({
        url: "/user/me",
        method: "PATCH",
        body: formData,
      }),
    }),

    //* Update password ********************************************
    updatePassword: builder.mutation({
      query: (formData) => ({
        url: "/user/update-my-password",
        method: "PATCH",
        body: formData,
      }),
    }),

    //* sendVerificationCode ***************************************
    sendVerificationCode: builder.mutation({
      query: (formData) => ({
        url: "/user/send-verificationCode",
        method: "POST",
        body: formData,
      }),
    }),

    //* verifyEmailOrPhone *****************************************
    verifyEmailOrPhone: builder.mutation({
      invalidatesTags: () => [{ type: "me" }],
      query: (formData) => ({
        url: "/user/verify/email-or-phone",
        method: "POST",
        body: formData,
      }),
    }),

    //* deactivate account *****************************************
    deactivateAccount: builder.mutation({
      query: () => ({
        url: "/user/deactivate",
        method: "PATCH",
        body: {},
      }),
    }),

    //* delete account *********************************************
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/user/me",
        method: "DELETE",
      }),
    }),

    //* Get all users **********************************************
    getAllUsers: builder.query({
      providesTags: (result) => {
        if (!result) return [];

        const tags = result.data.users.map((el) => ({
          type: "user",
          id: el._id,
        }));
        return tags;
      },
      query: (queryData) => ({
        url: "/user",
        method: "GET",
        params: queryData,
      }),
    }),

    //* Get user by Id *********************************************
    getUserById: builder.query({
      providesTags: (result, error, userId) => [{ type: "user", id: userId }],
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
    }),

    //* Update user by Id ******************************************
    updateUserById: builder.mutation({
      invalidatesTags: (result, error, { userId }) => [
        { type: "user", id: userId },
      ],
      query: ({ userId, form }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        body: form,
      }),
    }),

    //* Delete user by Id ******************************************
    deleteUserById: builder.mutation({
      invalidatesTags: (result, error, userId) => [
        { type: "user", id: userId },
      ],
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
    }),

    //* Get guides *************************************************
    getGuides: builder.query({
      query: () => ({
        url: "/user/guides",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
  useSendVerificationCodeMutation,
  useVerifyEmailOrPhoneMutation,
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
  useGetGuidesQuery,
} = userApi;
