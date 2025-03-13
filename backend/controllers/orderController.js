import orderModel from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import productModel from "../models/productModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { products, totalAmount } = req.body;

  const shippingAddress = req.user.address;

  for (const item of products) {
    const product = await productModel.findById(item.product);
    if (product.quantity < item.quantity) {
      throw new Error(
        `${product.name} has only ${product.quantity} left. Please reduce the quantity.`
      );
    }
  }

  const newOrder = await orderModel.create({
    orderBy: req.user._id,
    orderItems: products,
    shippingAddress,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

// @desc    Update Payment Status
// @route   PUT /api/orders/:id/payment
// @access  Public
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  const { id, status, updateTime, paymentMethod, currency, conversionRate } =
    req.body;

  const paymentResult = {
    transactionID: id,
    status,
    updateTime,
    currency,
    conversionRate,
  };
  if (status === "Success") {
    order.orderItems.forEach(async (item) => {
      await productModel.findByIdAndUpdate(item._id, {
        $inc: { quantity: -item.quantity },
      });
    });
  }

  order.paymentResult = paymentResult;
  order.deliveryStatus = status === "Success" ? "Processing" : "On-Hold";
  order.paymentMethod = paymentMethod;
  await order.save();
  res.status(204).json();
});

// @desc    Get Order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({
      path: "orderBy",
      select: "name email phone address",
    })
    .populate({
      path: "orderItems.product",
      select: "name image",
    });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myOrders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({ orderBy: req.user._id })
    .populate({
      path: "orderItems.product",
      select: "name image",
    })
    .populate({
      path: "orderBy",
      select: "name email address phone",
    })
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const { user } = req.query;

  const query = {};
  if (user !== undefined) {
    query.orderBy = user;
  }

  const orders = await orderModel
    .find(query)
    .populate({
      path: "orderBy.product",
      select: "name email",
    })
    .populate({
      path: "orderItems.product",
      select: "name image",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Update Delivery Status
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.deliveryStatus = req.body.deliveryStatus;
  await order.save();
  res.status(204).json();
});

// @desc    Total Sell report from start date to end date
// @route   GET /api/orders/sell/report?startDate={}&endDate={}
// @access  Private/Admin
const getTotalSellReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Start date and end date are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const salesSummary = await orderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        "paymentResult.status": "Success",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: null,
        totalProductsSold: { $sum: "$orderItems.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalProductsSold: 1,
        totalRevenue: 1,
        orders: 1,
      },
    },
  ]);

  res.json(salesSummary[0] || { totalProductsSold: 0, totalRevenue: 0 });
});

export {
  createOrder,
  updatePaymentStatus,
  getOrderById,
  getMyOrders,
  getOrders,
  updateDeliveryStatus,
  getTotalSellReport,
};
