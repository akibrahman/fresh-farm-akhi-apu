import apiSlice from "./apiSlice";
import { CATEGORY_URL } from "./constantURL";

export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchAllCategories: builder.query({
            query: () => ({
                url: `${CATEGORY_URL}/`,
                method: "GET",
            }),
            providesTags: ["Category"],
        }),
        fetchCategoryById: builder.query({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "GET",
            }),
            providesTags: ["Category"],
        }),
        createNewCategory: builder.mutation({
            query: (category) => ({
                url: CATEGORY_URL,
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["Category"],
        }),
        updateCategory: builder.mutation({
            query: (updatedCategory) => ({
                url: `${CATEGORY_URL}/${updatedCategory._id}`,
                method: "PATCH",
                body: updatedCategory,
            }),
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `${CATEGORY_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useFetchAllCategoriesQuery,
    useFetchCategoryByIdQuery,
    useCreateNewCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
