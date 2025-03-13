import apiSlice from "./apiSlice";

const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/api/contact',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
    getMessages: builder.query({
      query: () => '/api/contact',
      providesTags: ['Contact'],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/api/contact/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
} = contactApiSlice;

export default contactApiSlice;