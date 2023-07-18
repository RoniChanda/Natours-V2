import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "../customFetchBase";

export const tourApi = createApi({
  reducerPath: "tourApi",
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    //* fetch all tours ********************************************
    fetchAllTours: builder.query({
      providesTags: () => [{ type: "tours" }],
      query: (queryData) => ({
        url: `/tour`,
        method: "GET",
        params: queryData,
      }),
    }),

    //* fetch tour details *****************************************
    fetchTourDetails: builder.query({
      providesTags: (result, error, id) => [{ type: "tour", id }],
      query: (id) => ({
        url: `/tour/${id}`,
        method: "GET",
      }),
    }),

    //* fetch tour reviews *****************************************
    fetchTourReviews: builder.query({
      providesTags: () => [{ type: "tourReviews" }],
      query: ({ rating, tourId }) => ({
        url: `/tour/${tourId}/reviews`,
        method: "GET",
        params: { rating },
      }),
    }),

    //* create tour *************************************************
    createTour: builder.mutation({
      invalidatesTags: () => [{ type: "tours" }],
      query: (form) => ({
        url: "/tour",
        method: "POST",
        body: form,
      }),
    }),

    //* update tour ************************************************
    updateTour: builder.mutation({
      invalidatesTags: (result, error, { tourId }) => [
        { type: "tour", id: tourId },
        { type: "tours" },
      ],
      query: ({ tourId, form }) => ({
        url: `/tour/${tourId}`,
        method: "PATCH",
        body: form,
      }),
    }),

    //* delete tour ************************************************
    deleteTour: builder.mutation({
      invalidatesTags: () => [{ type: "tours" }],
      query: (tourId) => ({
        url: `/tour/${tourId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchAllToursQuery,
  useLazyFetchAllToursQuery,
  useFetchTourDetailsQuery,
  useFetchTourReviewsQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
} = tourApi;
