import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useFetchOrderByIdQuery } from "@/store/slices/api/orderApiSlice";
import OrderDetails from "@/components/orderDetails";
import { withAuth } from "@/utils/withAuth";

function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [orderData, setOrderData] = useState(null);
  const { data } = useFetchOrderByIdQuery(id, { skip: !id });
  useEffect(() => {
    if (data) {
      setOrderData(data.order);
    }
  }, [data]);

  if (!orderData) return <div>Loading...</div>;

  return (
    <div className="py-10 px-10">
      <OrderDetails order={orderData} />
    </div>
  );
}

export default withAuth(OrderDetail, {
  requireLogin: true,
});
