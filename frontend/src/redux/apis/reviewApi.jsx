import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "../customFetchBase";
import { logError } from "../../utils/logError";
import { tourApi } from "./tourApi";
import { bookingApi } from "./bookingApi";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    //* Get all reviews ********************************************
    getAllReviews: builder.query({
      providesTags: () => [{ type: "reviews" }],
      query: (queryData) => ({
        url: "review",
        method: "GET",
        params: queryData,
      }),
    }),

    //* update review by Id *******************************************
    updateReview: builder.mutation({
      invalidatesTags: () => [{ type: "reviews" }],
      query: ({ reviewId, formData }) => ({
        url: `/review/${reviewId}`,
        method: "PATCH",
        body: formData,
      }),

      async onQueryStarted(args, obj) {
        logError(obj, async () => {
          await obj.queryFulfilled;
          obj.dispatch(tourApi.util.invalidateTags(["tours"]));
          obj.dispatch(bookingApi.util.invalidateTags(["userBookings"]));
        });
      },
    }),

    //* delete review by Id *******************************************
    deleteReview: builder.mutation({
      invalidatesTags: () => [{ type: "reviews" }],
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: "DELETE",
      }),

      async onQueryStarted(args, obj) {
        logError(obj, async () => {
          await obj.queryFulfilled;
          obj.dispatch(tourApi.util.invalidateTags(["tours"]));
          obj.dispatch(bookingApi.util.invalidateTags(["userBookings"]));
        });
      },
    }),

    //* user feedback on review ************************************
    provideFeedback: builder.mutation({
      query: ({ reviewId, feedback }) => ({
        url: `/review/${reviewId}/feedback`,
        method: "PATCH",
        body: { feedback },
      }),

      async onQueryStarted(args, obj) {
        logError(obj, async () => {
          await obj.queryFulfilled;
          obj.dispatch(tourApi.util.invalidateTags(["tourReviews"]));
        });
      },
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useProvideFeedbackMutation,
} = reviewApi;
