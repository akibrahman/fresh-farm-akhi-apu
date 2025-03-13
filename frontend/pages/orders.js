import React, { useEffect, useState } from "react";
import { useFetchMyOrdersQuery } from "@/store/slices/api/orderApiSlice";
import OrderDetails from "@/components/orderDetails.js";
import { withAuth } from "@/utils/withAuth";

const Orders = () => {
  const { data } = useFetchMyOrdersQuery();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (data) {
      setOrders(data.orders);
    }
  }, [data]);
  return (
    <div className="py-16 px-20 bg-gray-100">
      <h1 className="text-black font-bold text-2xl pb-6">
        {orders.length === 0 ? `You don't have any orders yet` : `My Orders`}
      </h1>
      <div className="flex flex-col gap-12">
        {orders.map((order) => (
          <OrderDetails key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default withAuth(Orders, {
  requireLogin: true,
});
