// components/Dashboard.js
import { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { useLazyFetchSellReportQuery } from "@/store/slices/api/orderApiSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "@/components/Admin/Admin-Sidebar";
import { withAuth } from "@/utils/withAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [sellReportData, setSellReportData] = useState([]);
  const [fetchSellReport] = useLazyFetchSellReportQuery();

  useEffect(() => {
    const fetchMonthlyReports = async () => {
      const endDate = new Date();
      let reports = [];

      const fetchReportForMonth = async (monthOffset) => {
        const monthEndDate = endOfMonth(subMonths(endDate, monthOffset));
        const monthStartDate = startOfMonth(subMonths(endDate, monthOffset));
        monthStartDate.setHours(0, 0, 0, 0);
        monthEndDate.setHours(23, 59, 59, 999);
        const formattedStartDate = format(
          monthStartDate,
          "yyyy-MM-dd'T'HH:mm:ss.SSS"
        );
        const formattedEndDate = format(
          monthEndDate,
          "yyyy-MM-dd'T'HH:mm:ss.SSS"
        );

        const res = await fetchSellReport({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        }).unwrap();

        return { month: formattedStartDate, report: res };
      };

      const promises = [];
      for (let i = 0; i < 6; i++) {
        promises.push(fetchReportForMonth(i));
      }

      reports = await Promise.all(promises);
      setSellReportData(reports);
    };

    fetchMonthlyReports();
  }, [fetchSellReport]);

  const totalIncome = useMemo(() => {
    return sellReportData.reduce((acc, report) => {
      return acc + report.report.totalRevenue;
    }, 0);
  }, [sellReportData]);

  const totalProductsSold = useMemo(() => {
    return sellReportData.reduce((acc, report) => {
      return acc + report.report.totalProductsSold;
    }, 0);
  }, [sellReportData]);

  const totalRevenueData = sellReportData.map(
    (item) => item.report.totalRevenue
  );
  const totalProductsSoldData = sellReportData.map(
    (item) => item.report.totalProductsSold
  );

  const maxRevenue = Math.max(...totalRevenueData);
  const maxProductsSold = Math.max(...totalProductsSoldData);

  const revenuePercentages = totalRevenueData.map((value) =>
    maxRevenue ? (value / maxRevenue) * 100 : 0
  );
  const productsSoldPercentages = totalProductsSoldData.map((value) =>
    maxProductsSold ? (value / maxProductsSold) * 100 : 0
  );

  const data = {
    labels: sellReportData.map((item) =>
      new Date(item.month).toLocaleString("default", { month: "long" })
    ),
    datasets: [
      {
        label: "Income",
        data: revenuePercentages,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Products Sold",
        data: productsSoldPercentages,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income and Expense Chart",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              const maxValue =
                context.dataset.label === "Income"
                  ? maxRevenue
                  : maxProductsSold;
              const suffix =
                context.dataset.label === "Income" ? "BDT" : "units";
              label += `${
                (parseInt(context.parsed.y) * maxValue) / 100
              } ${suffix}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 text-black">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-6">
          Welcome to the Admin Dashboard. Here you can manage users, view
          reports, and more.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-500 text-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
            <p>{totalIncome}</p>
          </div>
          <div className="bg-green-500 text-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Total Products Sold</h2>
            <p>{totalProductsSold}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-12">
          <h2 className="text-xl font-semibold mb-6">Graph Chart</h2>
          <Bar data={data} options={options} height={100} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard, { requireLogin: true, requireAdmin: true });
