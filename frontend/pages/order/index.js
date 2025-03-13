import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useFetchMyOrdersQuery } from "../../store/slices/api/orderApiSlice";
import { useState } from "react";
import { withAuth } from "@/utils/withAuth";

const OrderPage = () => {
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.user);
  const { data, error, isLoading } = useFetchMyOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders =
    data?.orders?.filter((order) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchTermLower) ||
        order.deliveryStatus.toLowerCase().includes(searchTermLower) ||
        order.paymentResult.status.toLowerCase().includes(searchTermLower)
      );
    }) || [];

  const onGotoOrderDetails = (orderID) => {
    router.push(`/order/${orderID}`);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-black">
        My Orders
      </h1>

      {/* Search bar */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by Order ID, Delivery or Payment Status"
          className="w-full px-4 py-2 rounded-md border-2 text-black focus:outline-none focus:text-black placeholder-gray-400 transition duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
          Error loading orders.
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-md">
          No orders found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white text-center">
              <tr>
                <th className="py-3 px-4 ">Order ID</th>
                <th className="py-3 px-4 ">Total Amount</th>
                <th className="py-3 px-4 ">Delivery Status</th>
                <th className="py-3 px-4 ">Payment Status</th>
                <th className="py-3 px-4 ">Shipping Address</th>
                <th className="py-3 px-4 ">Order Items</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-xl text-center">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`hover:bg-indigo-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() => onGotoOrderDetails(order._id)}
                >
                  <td className="py-4 px-4 border-b border-indigo-100">
                    {order._id}
                  </td>
                  <td className="py-4 px-4 border-b border-indigo-100">
                    {order.totalAmount.toFixed(2)} TK
                  </td>
                  <td className="py-4 px-4 border-b border-indigo-100">
                    <span
                      className={`px-2 py-1 rounded-full text-base font-semibold
                                            ${
                                              order.deliveryStatus ===
                                              "Delivered"
                                                ? "bg-green-200 text-green-800"
                                                : order.deliveryStatus ===
                                                  "Shipping"
                                                ? "bg-blue-200 text-blue-800"
                                                : "bg-yellow-200 text-yellow-800"
                                            }`}
                    >
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 border-b border-indigo-100">
                    <span
                      className={`px-2 py-1 rounded-full text-base font-semibold
                                            ${
                                              order.paymentResult.status ===
                                              "Success"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-red-200 text-red-800"
                                            }`}
                    >
                      {order.paymentResult.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 border-b border-indigo-100">
                    {order.shippingAddress}
                  </td>
                  <td className="py-4 px-4 border-b border-indigo-100">
                    <div className="list-none m-0 space-y-2 bg-gray-100 p-2 rounded-md text-center">
                      {order.orderItems.map((item, index) => (
                        <p className="text-sm">
                          {item?.product?.name} X {item?.quantity} = &nbsp;
                          {`${(item.price * item.quantity).toFixed(2)}`} Tk
                        </p>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default withAuth(OrderPage, { requireLogin: true });
