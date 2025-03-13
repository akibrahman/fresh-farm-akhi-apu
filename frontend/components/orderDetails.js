import React from "react";
import {
  usePaymentVerificationMutation,
  useCreatePaymentIntentMutation,
} from "@/store/slices/api/paymentSlice";
import { useUpdatePaymentStatusMutation } from "@/store/slices/api/orderApiSlice";
import { toastManager } from "@/utils/toastManager";
import { formatToBangladeshDate } from "@/utils/formatDate";
import Image from "next/image";

const OrderDetails = ({ order }) => {
  const [paymentVerification] = usePaymentVerificationMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const formattedDate = formatToBangladeshDate(order.createdAt);

  const handlePaymentStatus = async () => {
    const toastId = toastManager.loading("Verifying payment status...");
    try {
      const res = await paymentVerification(order._id).unwrap();
      if (res.pay_status === "Not-Available") {
        toastManager.updateStatus(toastId, {
          render: "Payment status not available",
          type: "error",
        });
        return;
      }
      const paymentData = {
        id: res.pg_txnid,
        status: res.status_code === "2" ? "Success" : "Failed",
        updateTime: new Date(res.date_processed),
        currency: res.currency,
        paymentMethod: res.payment_processor,
        conversionRate: res.conversion_rate,
      };
      await updatePaymentStatus({ orderID: order._id, paymentData }).unwrap();
      if (res.status_code === "2") {
        toastManager.updateStatus(toastId, {
          render: "Payment verified successfully",
          type: "success",
        });
        return;
      }
      toastManager.updateStatus(toastId, {
        render: "Payment verification failed",
        type: "error",
      });
    } catch (error) {
      toastManager.updateStatus(toastId, {
        render: error.message || "Failed to verify payment status",
        type: "error",
      });
    }
  };

  const handleAgainPayment = async (e) => {
    e.preventDefault();
    const toastId = toastManager.loading("Generating payment link...");
    try {
      const paymentIntent = {
        amount: order.totalAmount,
        orderID: order._id,
        currency: "BDT",
      };
      const res = await createPaymentIntent(paymentIntent).unwrap();
      toastManager.updateStatus(toastId, {
        render: "Payment link generated successfully",
        type: "success",
      });
      toastManager.info("Redirecting to payment gateway...");
      setTimeout(() => {
        window.location.href = res.payment_url;
      }, 2000);
    } catch (error) {
      toastManager.updateStatus(toastId, {
        render: error.message || "Failed to generate payment link",
        type: "error",
      });
    }
  };

  return (
    <div className="flex gap-2 sm:flex-wrap xl:flex-nowrap">
      <div className="bg-white w-2/3 shadow-lg p-6 rounded-lg">
        <div className="bg-slate-700 p-5 text-gray-200">
          <p className="text-2xl font-bold ">
            Order Details: &nbsp;{" "}
            <span className="text-xl text-gray-300">{`#${order._id}`}</span>
          </p>
          <p>
            Date : &nbsp;
            <span className="text-[0.9rem] leading-6 text-gray-300">
              {formattedDate}
            </span>
          </p>
        </div>
        <div className="pt-10 px-12">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-3">Item</th>
                <th className="px-3 ">Quantity</th>
                <th className="px-3 ">Rate</th>
                <th className="px-3 ">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr className="border-b text-gray-600 ">
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                      <Image
                        src={`/${item.product?.image}`}
                        alt={item.product.name}
                        width={64}
                        height={48}
                        className="w-16 h-12 object-cover"
                      />
                      <p>{item.product.name}</p>
                    </div>
                  </td>
                  <td className="p-3 ">{item.quantity}</td>
                  <td className="p-3 ">{item.price}</td>
                  <td className="p-3 ">{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between">
            <p className="text-gray-500 font-bold pt-10 pb-5">
              Payment Method:
              <span className="text-gray-600 ps-3">{order.paymentMethod}</span>
            </p>
            <p className="text-gray-500 font-bold pt-10 pe-6">
              Total:
              <span className="text-gray-600 ps-3">{`${order.totalAmount} BDT`}</span>
            </p>
          </div>
          <p className="text-gray-600 pb-3">
            Transaction ID:
            <span className="text-gray-600 ps-3">
              {order.paymentResult.transactionID}
            </span>
          </p>
        </div>
      </div>
      <div className="flex w-2/3 gap-2 xl:w-1/3 xl:flex-wrap">
        <div className="bg-white text-black w-full shadow-lg p-6 mb-2 rounded-lg">
          <h2 className="text-gray-600 font-bold text-lg py-2">
            Payment Status:
          </h2>
          <p className="text-gray-500 pb-2">
            {order.paymentResult.status === "Success" ? (
              <span class="bg-green-100 text-green-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                Paid
              </span>
            ) : order.paymentResult.status === "Failed" ? (
              <div className="flex items-center gap-2">
                <span
                  onClick={handlePaymentStatus}
                  class="bg-red-100 cursor-pointer text-red-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400"
                >
                  Failed
                </span>
                <button
                  type="button"
                  onClick={handleAgainPayment}
                  class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Complete Payment
                </button>
              </div>
            ) : (
              <span
                onClick={handlePaymentStatus}
                class="bg-yellow-100 cursor-pointer text-yellow-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"
              >
                Pending
              </span>
            )}
          </p>
          <h2 className="text-gray-600 font-bold text-lg py-2">
            Delivery Status:
          </h2>
          <p className="text-gray-500 pb-4">
            {order.deliveryStatus === "Delivered" ? (
              <span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                Delivered
              </span>
            ) : order.deliveryStatus === "Shipped" ? (
              <span class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">
                Shipped
              </span>
            ) : order.deliveryStatus === "Processing" ? (
              <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                Processing
              </span>
            ) : order.deliveryStatus === "On-Hold" ? (
              <span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                On-Hold
              </span>
            ) : (
              <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                Initiated
              </span>
            )}
          </p>
          {order.deliveryStatus === "Processing" && (
            <p className="text-blue-400 text-sm">
              We are processing your order now. You can expect a update within 2
              days.
            </p>
          )}
          {order.deliveryStatus === "On-Hold" && (
            <p className="text-red-400 text-sm">
              Your order in on hold. You haven't completed your payment. If you
              completed please click on the payment status button.
            </p>
          )}
          {order.deliveryStatus === "Shipped" && (
            <p className="text-green-400 text-sm">
              Your order has been shipped to our delivery partner. You can
              expect a delivery within 3 days.
            </p>
          )}
        </div>
        <div className="bg-white text-black w-full shadow-lg p-6 rounded-lg">
          <p className="text-gray-500">Customer Details</p>
          <p className="text-gray-500 font-bold">{order.orderBy.name}</p>
          <p className="text-gray-500 ">Phone: &nbsp;{order.orderBy.phone}</p>
          <p className="text-gray-500">Email: &nbsp; {order.orderBy.email}</p>
          <p className="text-gray-500">
            Shipping Address: &nbsp;{order.orderBy.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
