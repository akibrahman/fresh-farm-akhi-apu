import express from "express";
import {
  createOrder,
  getOrderById,
  updatePaymentStatus,
  getMyOrders,
  getOrders,
  updateDeliveryStatus,
  getTotalSellReport,
} from "../controllers/orderController.js";
import protectMiddleware from "../middleware/protectMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protectMiddleware(), createOrder)
  .get(protectMiddleware("admin"), getOrders);

router.route("/myOrders").get(protectMiddleware(), getMyOrders);

router.route("/:id").get(protectMiddleware(), getOrderById);

router.route("/:id/payment").patch(updatePaymentStatus);

router
  .route("/:id/deliver")
  .patch(protectMiddleware("admin"), updateDeliveryStatus);

router
  .route("/sell/report")
  .get(protectMiddleware("admin"), getTotalSellReport);

export default router;
