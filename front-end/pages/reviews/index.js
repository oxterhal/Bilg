import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Send } from "lucide-react";

export default function Reviews() {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:10000/reviews");
        setReviews(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleCreateReview = async () => {
    if (!userId || !productId || !rating || !reviewText) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("http://localhost:10000/createReviews", {
        user_id: parseInt(userId, 10),
        product_id: parseInt(productId, 10),
        rating: parseInt(rating, 10),
        review_text: reviewText,
      });
      // Reset form fields
      setUserId("");
      setProductId("");
      setRating("");
      setReviewText("");
      setError(null);
      // Refetch reviews
      const response = await axios.get("http://localhost:10000/reviews");
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          Reviews
        </h1>
        {/* Review Form */}
        <div>
          <div className="h-36 flex flex-col justify-center items-between">
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID"
              className="w-full p-3 bg-white border border-gray-300 "
            />
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID"
              className="w-full p-3 bg-white border border-gray-300 "
            />
          </div>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-3 mt-4 bg-white border border-gray-300 text-gray-900 "
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {[...Array(num)].map(() => "★")}
              </option>
            ))}
          </select>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 mt-4 bg-white border border-gray-300 text-gray-900 "
          ></textarea>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          <button
            onClick={handleCreateReview}
            disabled={isLoading}
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send size={20} />
            <span> Submit Review</span>
          </button>
        </div>
        <br />
        <br />
        <br />
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white rounded-lg p-5 shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  User #{review.user_id}
                </span>
                <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-gray-900 mb-2">{review.review_text}</p>
              <div className="text-sm text-gray-500">
                Product #{review.product_id} •{" "}
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
