import apiSlice from "./apiSlice";
import { UPLOAD_URL } from "./constantURL";

const uploadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadUserImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}/user`,
        method: "POST",
        body: formData,
      }),
    }),
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}/product`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteImage: builder.mutation({
      query: (imagePath) => ({
        url: `${UPLOAD_URL}/removeImage`,
        method: "POST",
        body: { imagePath },
      }),
    }),
  }),
});

export const {
  useUploadUserImageMutation,
  useUploadProductImageMutation,
  useDeleteImageMutation,
} = uploadsApi;
