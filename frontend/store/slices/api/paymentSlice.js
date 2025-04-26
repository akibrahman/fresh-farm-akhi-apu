import apiSlice from "./apiSlice";
import { PAYMENT_URL } from "./constantURL";

const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (payment) => ({
        url: `${PAYMENT_URL}`, // `/api/payment`
        method: "POST",
        body: payment,
      }),
    }),
    paymentVerification: builder.mutation({
      query: ({orderID, sessionId}) => ({
        url: `${PAYMENT_URL}/payment_verification`,
        method: "POST",
        body: { orderID, sessionId },
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  usePaymentVerificationMutation,
} = paymentApiSlice;
