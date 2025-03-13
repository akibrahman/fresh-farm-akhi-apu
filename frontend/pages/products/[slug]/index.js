import { useFetchProductBySlugQuery } from "@/store/slices/api/productApiSlice";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import {
  useCanReviewProductQuery,
  useGetReviewsQuery,
} from "@/store/slices/api/reviewApiSlice";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";

const ProductDetails = () => {
  const slug = useRouter().query.slug;
  const {
    data: product,
    error,
    isLoading,
  } = useFetchProductBySlugQuery(slug, { skip: !slug });

  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: reviews = [] } = useGetReviewsQuery(product?._id, { skip: !product });
  const { data: canReview } = useCanReviewProductQuery(product?._id, { skip: !product || !userInfo });

  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = totalRating / reviews.length;
      setAverageRating(average);
    }
  }, [reviews]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const addToCartFunction = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative w-full border-2 border-green-300" style={{ height: '300px', maxWidth: '550px', margin: '15px auto 0' }}>
          <Image
          src={`/${product.image}` || "/placeholder-image.jpg"}   
          alt={`${product.name} image`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="p-8 space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    index < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-3 text-gray-600">({reviews.length} reviews)</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-gray-700">
              ৳{product.price.toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <span className="font-semibold text-gray-700">Availability:</span>
            <span className="ml-2 text-green-600">
              {product.quantity > 0 ? `In stock (${product.quantity})` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={addToCartFunction}
              className={`w-[40%] py-3 px-6 rounded-lg transition duration-300 ease-in-out transform ${
                product.quantity > 0
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-400 text-gray-800 cursor-not-allowed'
              }`}
              disabled={product.quantity <= 0}
            >
              {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
        <ReviewsList productId={product._id} />
        {userInfo && (
          <>
            <h3 className="text-xl font-bold mt-8 mb-4">Add Your Review</h3>
            <ReviewForm productId={product._id} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
