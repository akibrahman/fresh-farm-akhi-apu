import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Admin/Admin-Sidebar";
import {
  useFetchAllOrdersQuery,
  useUpdateDeliveryStatusMutation,
} from "@/store/slices/api/orderApiSlice";
import { toastManager } from "@/utils/toastManager";
import { withAuth } from "@/utils/withAuth";
import { formatToBangladeshDate } from "@/utils/formatDate";
import { useTable, useGlobalFilter, usePagination } from "react-table";
import { IoFastFood } from "react-icons/io5";

const ViewOrders = () => {
  const router = useRouter();
  const { query } = router;
  const params = query.user;
  const { data } = useFetchAllOrdersQuery({ params });
  const [orderList, setOrderList] = useState([]);
  const [updateDeliveryStatus] = useUpdateDeliveryStatusMutation();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (data) {
      setOrderList(data.orders);
    }
  }, [data]);

  const updateOrderList = (id, status) => {
    setOrderList((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, deliveryStatus: status } : order
      )
    );
  };

  const handleDeliveryStatus = async (id, status, pay_status) => {
    const toastId = toastManager.loading("Updating delivery status...");
    if (pay_status === "Failed" || pay_status === "Pending") {
      toastManager.updateStatus(toastId, {
        render:
          "Payment status is failed. You cannot update the delivery status",
        type: "error",
      });
      return;
    }
    if (status === "Initiated") {
      toastManager.updateStatus(toastId, {
        render: "Delivery status cannot be initiated",
        type: "error",
      });
      return;
    }
    try {
      await updateDeliveryStatus({
        orderID: id,
        deliveryStatus: status,
      }).unwrap();
      toastManager.updateStatus(toastId, {
        render: "Delivery status updated successfully",
        type: "success",
      });
      updateOrderList(id, status);
    } catch (error) {
      toastManager.updateStatus(toastId, {
        render: error.message || "Failed to update delivery status",
        type: "error",
      });
    }
  };

  const deliveryStatuses = [
    "Initiated",
    "Processing",
    "On-Hold",
    "Shipped",
    "Delivered",
  ];

  const onGotoOrderDetails = (orderID, cellValue) => {
    if (deliveryStatuses.includes(cellValue)) {
      return;
    }
    router.push(`/admin/orders/${orderID}`);
  };

  const columns = React.useMemo(
    () => [
      { Header: "Order ID", accessor: "_id" },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ value }) => formatToBangladeshDate(value),
      },
      { Header: "Price", accessor: "totalAmount" },
      { Header: "Method", accessor: "paymentMethod" },
      { Header: "Transaction ID", accessor: "paymentResult.transactionID" },
      {
        Header: "Payment",
        accessor: "paymentResult.status",
        Cell: ({ value }) => (
          <span
            className={`font-bold ${
              value === "Failed" ? "text-red-600" : "text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Delivery Status",
        accessor: "deliveryStatus",
        Cell: ({ row: { original }, value }) => (
          <select
            className="border p-2 rounded-lg"
            disabled={
              value === "Delivered" ||
              value === "Initiated" ||
              original.paymentResult.status === "Failed"
            }
            value={value}
            onChange={(e) =>
              handleDeliveryStatus(
                original._id,
                e.target.value,
                original.paymentResult.status
              )
            }
            style={{
              backgroundColor: ["Initiated", "On-Hold"].includes(value)
                ? "yellow"
                : "green",
              color: ["Initiated", "On-Hold"].includes(value)
                ? "black"
                : "white",
            }}
          >
            {deliveryStatuses.map((status) => (
              <option key={`${status}-${original._id}`} value={status}>
                {status}
              </option>
            ))}
          </select>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: orderList,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    setPageSize(10);
  }, [setPageSize]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setGlobalFilter(e.target.value);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="py-10 px-16 bg-gray-100 flex-grow">
        <h1 className="text-black font-bold text-3xl mb-6">Orders</h1>
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="border p-2 px-4 rounded-lg w-full md:w-1/3 shadow-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="overflow-x-auto mb-6">
          <table
            className="min-w-full bg-white text-black shadow-lg rounded-lg overflow-hidden"
            {...getTableProps()}
          >
            <thead className="bg-gray-300">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="p-3 text-left font-semibold"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length > 0 ? (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      key={row.id}
                      {...row.getRowProps()}
                      className={`hover:bg-gray-100 transition-colors duration-300 ${
                        row.original.deliveryStatus === "Shipped"
                          ? "bg-green-100"
                          : row.original.deliveryStatus === "Delivered"
                          ? "bg-green-200"
                          : row.original.deliveryStatus === "On-Hold"
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          onClick={() =>
                            onGotoOrderDetails(row.original._id, cell.value)
                          }
                          className="p-3 border-b"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-3 text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {"<"}
          </button>
          <span className="text-lg font-semibold">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{pageCount}</strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ViewOrders, {
  requireLogin: true,
  requireAdmin: true,
});
