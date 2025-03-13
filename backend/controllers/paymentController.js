import asyncHandler from "../middleware/asyncHandler.js";
import orderModel from "../models/orderModel.js";
import axios from "axios";

// @desc    Create Payment Intent
// @route   POST /api/payment
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, orderID, currency } = req.body;
  const { email, name, phone } = req.user;
  const description = "FarmFresh Store Payment";
  const successUrl = `${process.env.FRONTEND_URL}/payment/payment-successful?order_id=${orderID}`;
  const cancelUrl = `${process.env.FRONTEND_URL}/`;
  const failUrl = `${process.env.FRONTEND_URL}/payment/payment-successful?order_id=${orderID}`;
  const paymentIntent = {
    store_id: process.env.AMARPAY_STORE_ID,
    signature_key: process.env.AMARPAY_SECRET_KEY,
    tran_id: orderID,
    amount: amount,
    currency: currency,
    desc: description,
    cus_name: name,
    cus_email: email,
    cus_phone: phone,
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    type: "json",
  };
  const order = await orderModel.findById(orderID);
  const amarPayURL = `${process.env.AMARPAY_BASE_URL}/jsonpost.php`;
  try {
    const response = await axios.post(amarPayURL, paymentIntent);
    const transactionId = response.data.payment_url.split("track=")[1];
    order.deliveryStatus = "On-Hold";
    order.paymentResult.transactionID = transactionId;
    order.paymentResult.currency = currency;
    await order.save();
    res.json(response.data);
  } catch (error) {
    res.status(400);
    throw new Error("Payment failed");
  }
});

// @desc    Payment Verification
// @route   POST /api/payment/payment-verification
// @access  Public
const paymentVerification = asyncHandler(async (req, res) => {
  const orderID = req.body.orderID;
  const storeID = process.env.AMARPAY_STORE_ID;
  const signatureKey = process.env.AMARPAY_SECRET_KEY;
  const verificationURL = `${process.env.AMARPAY_BASE_URL}/api/v1/trxcheck/request.php?request_id=${orderID}&store_id=${storeID}&signature_key=${signatureKey}&type=json`;
  try {
    const response = await axios.get(verificationURL);
    res.json(response.data);
  } catch (error) {
    res.status(400);
    throw new Error("Payment verification failed");
  }
});

export { createPaymentIntent, paymentVerification };
