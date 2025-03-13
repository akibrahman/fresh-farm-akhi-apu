import mongoose from "mongoose";

// Order Item Schema
const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = mongoose.Schema(
  {
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String },
    paymentResult: {
      transactionID: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
      },
      updateTime: { type: Date, default: Date.now() },
      currency: { type: String },
      convertionRate: { type: Number },
    },
    totalAmount: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      default: "Initiated",
      enum: ["Initiated", "Processing", "On-Hold", "Shipped", "Delivered"],
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
