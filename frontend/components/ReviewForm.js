import React, { useState } from "react";
import { useCreateReviewMutation } from "../store/slices/api/reviewApiSlice";
import { toastManager } from "@/utils/toastManager.js";
import { useSelector } from "react-redux";

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || !comment || comment.trim() === "") {
      toastManager.error("Please fill in both rating and comment");
      return;
    }

    try {
      const result = await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toastManager.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toastManager.error(err.data?.message || "Failed to add review");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((r) => (
            <svg
              key={r}
              onClick={() => setRating(r)}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 cursor-pointer ${
                r <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="comment">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Write your review here..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
