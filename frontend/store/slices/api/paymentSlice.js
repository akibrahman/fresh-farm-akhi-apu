import apiSlice from "./apiSlice";
import { PAYMENT_URL } from "./constantURL";

const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (payment) => ({
        url: `${PAYMENT_URL}`,
        method: "POST",
        body: payment,
      }),
    }),
    paymentVerification: builder.mutation({
      query: (orderID) => ({
        url: `${PAYMENT_URL}/payment_verification`,
        method: "POST",
        body: { orderID },
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  usePaymentVerificationMutation,
} = paymentApiSlice;
