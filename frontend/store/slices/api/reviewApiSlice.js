import apiSlice from "./apiSlice";

const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: '/api/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
    getReviews: builder.query({
      query: (productId) => `api/reviews/product/${productId}`,
      providesTags: ['Review'],
    }),
    canReviewProduct: builder.query({
      query: (productId) => `/reviews/can-review/${productId}`,
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `api/reviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `api/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useCanReviewProductQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;

export default reviewApiSlice;
