import apiSlice from "./apiSlice";
import { USER_URL } from "./constantURL";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchMyProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation({
      query: (profileData) => ({
        url: `${USER_URL}/`,
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),
    fetchAllUsers: builder.query({
      query: () => ({
        url: `${USER_URL}/allusers`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    promoteAdminToUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useFetchMyProfileQuery,
  useUpdateMyProfileMutation,
  useFetchAllUsersQuery,
  usePromoteAdminToUserMutation,
  useDeleteUserMutation,
} = userApi;
