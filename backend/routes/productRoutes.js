import express from "express";
import protectMiddlewere from "../middleware/protectMiddleware.js";
import {
  getProducts,
  getProductBySlug,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getTrendingProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Define routes
productRouter
  .route("/")
  .get(getProducts)
  .post(protectMiddlewere("admin"), createNewProduct);

productRouter.route("/:slug").get(getProductBySlug);

productRouter
  .route("/:id")
  .delete(protectMiddlewere("admin"), deleteProduct)
  .patch(protectMiddlewere("admin"), updateProduct);
productRouter.route("/top/trending").get(getTrendingProducts);

export default productRouter;
