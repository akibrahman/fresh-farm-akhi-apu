import React, { useState } from 'react';
import { useGetReviewsQuery, useDeleteReviewMutation, useUpdateReviewMutation } from '../store/slices/api/reviewApiSlice';
import { useSelector } from 'react-redux';
import { toastManager } from "@/utils/toastManager.js";
import { FaStar, FaRegStar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewsList = ({ productId }) => {
  const { data: reviews, error, isLoading } = useGetReviewsQuery(productId);
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: '', comment: '' });
  const [visibleReviews, setVisibleReviews] = useState(2);
  const user = useSelector((state) => state.user.user);

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId).unwrap();
        toastManager.success('Review deleted successfully');
      } catch (error) {
        toastManager.error('Failed to delete review');
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: '', comment: '' });
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      await updateReview({ id: reviewId, ...editForm }).unwrap();
      setEditingReview(null);
      toastManager.success('Review updated successfully');
    } catch (error) {
      toastManager.error('Failed to update review');
    }
  };

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 2);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  return (
    <div className="text-black w-[100%] mx-auto text-left py-10">

      <h2 className="text-2xl font-semibold mb-4">Reviews <span className='text-xl'>({reviews ? reviews.length : 0})</span></h2>
      {reviews && reviews.length === 0 ? (
        <p className="text-gray-600 italic">No reviews yet</p>
      ) : reviews ? ( // Add this line for null check
        reviews && reviews.slice(0, visibleReviews).map((review) => (
          <div key={review._id} className="mb-4 border-b pb-4">
            {editingReview === review._id ? (
              <div>
                <h3 className="text-lg font-semibold">{review.user.name}</h3>
                <input
                  type="number"
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                  className="border p-1 mb-2 w-full"
                  min="1"
                  max="5"
                />
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  className="border p-1 mb-2 w-full"
                />
                <button onClick={() => handleSaveEdit(review._id)} className="text-blue-600 mr-2">Save</button>
                <button onClick={handleCancelEdit} className="text-gray-600">Cancel</button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">{review.user.name}</h3>
                <div className="text-yellow-500 flex">
                  {renderStars(review.rating)}
                </div>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                {user && user._id === review.user._id && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : null} 
      {reviews && visibleReviews < reviews.length && (
        <button
          onClick={handleShowMore}
          className="mt-1 bg-blue-500 text-white py-2 px-3 rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default ReviewsList;
