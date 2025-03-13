import Sidebar from "@/components/Admin/Admin-Sidebar";
import { useFetchOrderByIdQuery } from "@/store/slices/api/orderApiSlice";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatToBangladeshDate } from "@/utils/formatDate";
import { withAuth } from "@/utils/withAuth";

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const { data, isLoading, error } = useFetchOrderByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setOrder(data.order);
    }
  }, [data]);

  if (!order) return <p>Loading...</p>;

  const formattedDate = formatToBangladeshDate(order.createdAt);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-10 bg-gray-100 flex-grow">
        <h1 className="text-black font-bold text-2xl pb-6">Order Details</h1>
        <div className="flex gap-2">
          <div className="bg-white w-2/3 shadow-lg p-6 rounded-lg">
            <div className="bg-slate-700 p-5  text-white ">
              <p className="text-2xl font-bold">
                Order &nbsp;
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
                  {order.orderItems.map((item, index) => (
                    <tr className="border-b text-gray-600" key={index}>
                      <td className="p-3">
                        <div className="flex gap-2 items-center">
                          <img
                            src={`/${item.product.image}`}
                            alt={item.product.name}
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
                  <span className="text-gray-600 ps-3">
                    {order.paymentMethod}
                  </span>
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
                  <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                    Paid
                  </span>
                ) : order.paymentResult.status === "Failed" ? (
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 cursor-pointer text-red-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                      Failed
                    </span>
                  </div>
                ) : (
                  <span className="bg-yellow-100 cursor-pointer text-yellow-800 text-sm font-medium me-2 px-10 py-1 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                    Pending
                  </span>
                )}
              </p>
              <h2 className="text-gray-600 font-bold text-lg py-2">
                Delivery Status:
              </h2>
              <p className="text-gray-500 pb-4">
                {order.deliveryStatus === "Delivered" ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                    Delivered
                  </span>
                ) : order.deliveryStatus === "Shipped" ? (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">
                    Shipped
                  </span>
                ) : order.deliveryStatus === "Processing" ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                    Processing
                  </span>
                ) : order.deliveryStatus === "On-Hold" ? (
                  <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                    On-Hold
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-8 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                    Initiated
                  </span>
                )}
              </p>
            </div>
            <div className="bg-white text-black w-full shadow-lg p-6 rounded-lg">
              <p className="text-gray-500">Customer Details</p>
              <p className="text-gray-500 font-bold">{order.orderBy.name}</p>
              <p className="text-gray-500 ">
                Phone: &nbsp;{order.orderBy.phone}
              </p>
              <p className="text-gray-500">
                Email: &nbsp; {order.orderBy.email}
              </p>
              <p className="text-gray-500">
                Shipping Address: &nbsp;{order.orderBy.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(OrderDetails, {
  requireLogin: true,
  requireAdmin: true,
});
