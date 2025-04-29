import asyncHandler from "../middleware/asyncHandler.js";
import orderModel from "../models/orderModel.js";
import axios from "axios";
import Stripe from "stripe";

// @desc    Create Payment Intent
// @route   POST /api/payment
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  try {
    const { amount, orderID, currency } = req.body;
    const { email, name, phone } = req.user;
    const description = "Fresh Farm Store Payment";
    const success_url = `${process.env.FRONTEND_URL}/payment/payment-successful?order_id=${orderID}&session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${process.env.FRONTEND_URL}?session_id={CHECKOUT_SESSION_ID}`;
    const order = await orderModel
      .findById(orderID)
      .populate("orderItems.product");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const productsForStripe = order.orderItems.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [`${process.env.FRONTEND_URL}/${item.product.image}`],
          metadata: {
            productId: item.product._id.toString(),
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      currency,
      payment_method_types: ["card"],
      line_items: productsForStripe,
      mode: "payment",
      customer_email: email,
      metadata: {
        customer_name: name,
        customer_phone: phone,
      },
      success_url,
      cancel_url,
    });

    order.deliveryStatus = "On-Hold";
    order.paymentResult.currency = currency;
    await order.save();
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Payment failed");
  }
});

// @desc    Payment Verification
// @route   POST /api/payment/payment-verification
// @access  Public
const paymentVerification = asyncHandler(async (req, res) => {
  try {
    const orderID = req.body.orderID;
    const sessionId = req.body.sessionId;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || !session?.payment_intent)
      throw new Error("Payment verification failed");
    const paymentIntentId = session.payment_intent;
    const order = await orderModel
      .findById(orderID)
      .populate("orderItems.product");
    order.paymentResult.transactionID = paymentIntentId;
    await order.save();
    res.json({ success: true, message: "Verification Successful" });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Payment verification failed");
  }
});

export { createPaymentIntent, paymentVerification };
