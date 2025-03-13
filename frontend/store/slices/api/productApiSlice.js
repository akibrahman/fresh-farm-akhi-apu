import apiSlice from "./apiSlice";
import { PRODUCT_URL } from "./constantURL";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({ limit, category, page, sort, search }) => {
        const queryParams = [];
        if (limit) queryParams.push(`limit=${limit}`);
        if (category) queryParams.push(`category=${category}`);
        if (page) queryParams.push(`page=${page}`);
        if (sort) queryParams.push(`sort=${sort}`);
        if (search) queryParams.push(`search=${search}`);
        const queryString = queryParams.join("&");
        return {
          url: `${PRODUCT_URL}/?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),
    fetchProductBySlug: builder.query({
      query: (slug) => ({
        url: `${PRODUCT_URL}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    createNewProduct: builder.mutation({
      query: (product) => ({
        url: PRODUCT_URL,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductById: builder.mutation({
      query: (product) => ({
        url: `${PRODUCT_URL}/${product.id}`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    fetchCartProductsQuantity: builder.query({
      query: (products) => ({
        url: `${PRODUCT_URL}/quantity`,
        method: "GET",
        body: products,
      }),
    }),
    fetchTopTrendingProducts: builder.query({
      query: (limit) => ({
        url: `${PRODUCT_URL}/top/trending?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductBySlugQuery,
  useCreateNewProductMutation,
  useDeleteProductMutation,
  useUpdateProductByIdMutation,
  useFetchCartProductsQuantityQuery,
  useFetchTopTrendingProductsQuery,
} = productApi;
