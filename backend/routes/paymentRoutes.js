import {
  createPaymentIntent,
  paymentVerification,
} from "../controllers/paymentController.js";
import express from "express";
import protectMiddleware from "../middleware/protectMiddleware.js";

const router = express.Router();

router.route("/").post(protectMiddleware(), createPaymentIntent);
router.route("/payment_verification").post(paymentVerification);

export default router;
