import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentVerificationMutation } from "@/store/slices/api/paymentSlice";
import { useUpdatePaymentStatusMutation } from "@/store/slices/api/orderApiSlice";
import { toastManager } from "@/utils/toastManager";

const PaymentSuccessful = () => {
  const [paymentSuccess] = usePaymentVerificationMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderID = searchParams.get("order_id");
  useEffect(() => {
    const verifyPayment = async () => {
      const toastId = toastManager.loading("Verifying payment...");
      try {
        const response = await paymentSuccess(orderID).unwrap();
        const paymentData = {
          id: response.pg_txnid,
          status: response.status_code === "2" ? "Success" : "Failed",
          updateTime: new Date(response.date_processed),
          currency: response.currency,
          paymentMethod: response.payment_processor,
          conversionRate: response.conversion_rate,
        };
        if (response.status_code === "2") {
          await updatePaymentStatus({ orderID, paymentData }).unwrap();
          toastManager.updateStatus(toastId, {
            type: "success",
            render: "Payment verified successfully",
          });
          setTimeout(() => {
            router.push("/orders");
          }, 2000);
        } else {
          await updatePaymentStatus({ orderID, paymentData }).unwrap();
          throw new Error(
            "Payment Failed. Please contact support for more info."
          );
        }
      } catch (error) {
        const errorMessage =
          error?.data?.message || "Payment verification failed";
        toastManager.updateStatus(toastId, {
          type: "error",
          render: errorMessage,
        });
        setTimeout(() => {
          router.push(`/orders/${orderID}`);
        }, 1500);
      }
    };
    if (orderID) {
      verifyPayment();
    }
  }, [orderID]);

  return null;
};

export default PaymentSuccessful;
