import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!req.user) {
    throw new Error("User not authenticated");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // Check if the user has already reviewed the product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  // Check if the user has purchased the product
  const hasPurchased = await Order.exists({
    orderBy: req.user._id,
    'orderItems.product': productId,
    deliveryStatus: { $in: ['Delivered'] }, // Ensure the product has been delivered
  });

  if (!hasPurchased) {
    throw new Error('You have to purchase this product');
  }

  // Use create method to save the review
  const savedReview = await Review.create({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    comment,
  });

  res.status(201).json(savedReview);
});

// @desc    Get reviews for a specific product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ product: productId })
    .populate({
      path: 'user',
      select: 'name',
    })
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new Error("User not authorized");
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  const updatedReview = await review.save();
  res.status(200).json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
     throw new Error("You are not allowed to delete this review");
  }

  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review removed' });
});


export { createReview, getProductReviews ,updateReview,deleteReview};