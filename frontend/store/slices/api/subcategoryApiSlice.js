import apiSlice from "./apiSlice";
import { subcatagory_URL } from "./constantURL";

export const subcatagoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllSubCategories: builder.query({
      query: () => ({
        url: subcatagory_URL,
        method: "GET",
      }),
      providesTags: ["SubCategory"],
    }),
    fetchSubCategoryBySlug: builder.query({
      query: (slug) => ({
        url: `${subcatagory_URL}/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "SubCategory", id: slug }],
    }),
    createNewSubCategory: builder.mutation({
      query: (subCategory) => ({
        url: subcatagory_URL,
        method: "POST",
        body: subCategory,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, ...subCategory }) => ({
        url: `${subcatagory_URL}/${id}`,
        method: "PATCH",
        body: subCategory,
      }),
      invalidatesTags: ["SubCategory"],
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `${subcatagory_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubCategory"],
    }),
  }),
});

export const {
  useFetchAllSubCategoriesQuery,
  useFetchSubCategoryBySlugQuery,
  useCreateNewSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subcatagoriesApi;
