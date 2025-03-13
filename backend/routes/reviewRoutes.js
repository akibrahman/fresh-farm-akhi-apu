// routes/reviewRoutes.js
import express from 'express';
import { createReview, getProductReviews,updateReview,deleteReview } from '../controllers/reviewController.js';
import protect from "../middleware/protectMiddleware.js";

const router = express.Router();

router.route('/').post(protect(), createReview);
router.route('/product/:productId').get(getProductReviews);
router.route('/:id').put(protect(), updateReview);
router.route('/:id').delete(protect(), deleteReview);
export default router;