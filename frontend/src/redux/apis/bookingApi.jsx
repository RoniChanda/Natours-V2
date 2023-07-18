import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "../customFetchBase";
import { logError } from "../../utils/logError";
import { tourApi } from "./tourApi";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    //* checkout ***************************************************
    checkout: builder.mutation({
      query: ({ tourId, formData }) => ({
        url: `/booking/checkout-session/${tourId}`,
        method: "POST",
        body: formData,
      }),
    }),

    //* get my bookings ********************************************
    getMyBookings: builder.query({
      providesTags: () => [{ type: "myBookings" }],
      query: (queryData) => ({
        url: "/booking/me",
        method: "GET",
        params: queryData,
      }),
    }),

    //* cancel my booking ******************************************
    cancelMyBooking: builder.mutation({
      invalidatesTags: () => [{ type: "myBookings" }],
      query: (bookingId) => ({
        url: `/booking/me/${bookingId}`,
        method: "PATCH",
        body: {},
      }),
    }),

    //* create my review *******************************************
    createMyReview: builder.mutation({
      invalidatesTags: () => [{ type: "myBookings" }],
      query: ({ bookingId, formData }) => ({
        url: `/booking/${bookingId}/review`,
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        logError(obj, async () => {
          await obj.queryFulfilled;
          obj.dispatch(tourApi.util.invalidateTags(["tours"]));
        });
      },
    }),

    //* Get all bookings *******************************************
    getAllBookings: builder.query({
      query: (queryData) => ({
        url: "/booking",
        method: "GET",
        params: queryData,
      }),
    }),

    //* create Booking *********************************************
    createBooking: builder.mutation({
      query: (formData) => ({
        url: "/booking",
        method: "POST",
        body: formData,
      }),
    }),

    //* cancel booking by Id ***************************************
    cancelBookingById: builder.mutation({
      query: ({ userId, bookingId }) => ({
        url: `/booking/${bookingId}/cancel`,
        method: "PATCH",
        body: { userId },
      }),
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useCheckoutMutation,
  useGetMyBookingsQuery,
  useCancelMyBookingMutation,
  useCancelBookingByIdMutation,
  useCreateMyReviewMutation,
} = bookingApi;
