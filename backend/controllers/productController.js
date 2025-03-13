import productModel from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import OrderModel from "../models/orderModel.js";

// @desc    Fetch all products or filter by category
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, limit = 30, page = 1, sort, search } = req.query;
  let filter = {};

  if (category) {
    filter.category = { category };
  }
  if (search !== undefined) {
    filter.name = { $regex: search, $options: "i" };
  }

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const skip = (parsedPage - 1) * parsedLimit;

  const numberOfProducts = await productModel.countDocuments();
  const numberOfPages = Math.ceil(numberOfProducts / parsedLimit);

  let query = productModel.find(filter);

  if (sort) {
    if (sort === "lowToHigh") {
      query = query.sort({ price: 1 });
    }
    if (sort === "highToLow") {
      query = query.sort({ price: -1 });
    }
    if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }
  }

  const products = await query
    .skip(skip)
    .limit(parsedLimit)
    .populate({
      path: "category",
      select: "name",
    })
    .populate({
      path: "subCategory",
      select: "name",
    });

  res.status(200).json({
    status: "success",
    data: products,
    page: parsedPage,
    limit: parsedLimit,
    totalProducts: numberOfProducts,
    totalPages: numberOfPages,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productModel.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

const createNewProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    quantity,
    discount,
    discountValidTime,
    categoryId,
    subCategoryId,
    image,
  } = req.body;

  const newProduct = await productModel.create({
    name,
    price,
    description,
    quantity,
    discount,
    discountValidTime,
    category: categoryId,
    subCategory: subCategoryId,
    image,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findOne({ _id: req.params.id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    name,
    discount,
    discountValidTime,
    price,
    quantity,
    description,
    categoryId,
    subCategoryId,
    image,
  } = req.body;

  await productModel.findByIdAndUpdate(
    product._id,
    {
      name,
      discount,
      discountValidTime,
      price,
      quantity,
      description,
      category: categoryId,
      subCategory: subCategoryId,
      image,
    },
    {
      new: true,
      runValidators: false,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

// @desc    Trending products in last month
// @route   GET /api/trending?limit=number
// @access  Public
const getTrendingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let topProducts = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        "paymentResult.status": "Success",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: "$orderItems.product",
        totalSell: { $sum: 1 },
        totalQuantity: { $sum: "$orderItems.quantity" },
      },
    },
    {
      $sort: { totalSell: -1, totalQuantity: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        _id: 1,
        totalQuantity: 1,
        totalSell: 1,
        name: "$productDetails.name",
        image: "$productDetails.image",
        slug: "$productDetails.slug",
      },
    },
  ]);

  if (topProducts.length < limit) {
    const additionalProducts = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit - topProducts.length)
      .select("_id name image slug");

    // Map additional products to the same structure as topProducts
    const additionalProductsMapped = additionalProducts.map((product) => ({
      _id: product._id,
      totalQuantity: 0,
      totalSell: 0,
      name: product.name,
      image: product.image,
      slug: product.slug,
    }));

    // Combine topProducts and additionalProducts
    topProducts = topProducts.concat(additionalProductsMapped);
  }

  res.status(200).json(topProducts);
});

export {
  getProducts,
  getProductBySlug,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getTrendingProducts,
};
