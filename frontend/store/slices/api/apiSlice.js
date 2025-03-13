import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constantURL";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  mode: "cors",
});

const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Auth",
    "User",
    "Product",
    "Category",
    "SubCategory",
    "MyOrder",
    "AllOrders",
    'Review',
    'Contact'
  ],
  endpoints: (builder) => ({}),
});

export default apiSlice;
