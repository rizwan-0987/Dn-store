import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router"; 
import star_icon from "../assets/star_icon.png";
import star_dull_icon from "../assets/star_dull_icon.png";
import { getCurrentUser, onAuthChange } from "../../lib/authClient";
import "./DescriptionBox.css";
import { loadReviews, addReview } from "../../lib/reviews";

const DescriptionBox = ({ fullDescription, productId }) => {
  const starLabels = [
    { text: "Terrible", emoji: "😡", color: "red" },
    { text: "Poor", emoji: "😞", color: "red" },
    { text: "Average", emoji: "😐", color: "orange" },
    { text: "Good", emoji: "🙂", color: "green" },
    { text: "Excellent", emoji: "😍", color: "green" },
  ];

  const [hoveredRating, setHoveredRating] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const [user, setUser] = useState(getCurrentUser());
  useEffect(() => onAuthChange(setUser), []);

  const navigate = useNavigate();
  const location = useLocation();

  const displayName = useMemo(() => {
    if (!user) return "";
    if (user.name?.trim()) return user.name.trim();
    return user.email?.split("@")[0] || "User";
  }, [user]);

  const [reviews, setReviews] = useState(() => loadReviews(productId));
  useEffect(() => {
    setReviews(loadReviews(productId));
  }, [productId]);

  // Keep rating as number
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!newReview.rating || !newReview.comment.trim()) return;

    const created = addReview(productId, {
      name: displayName,
      rating: newReview.rating, 
      comment: newReview.comment,
    });

    setReviews((prev) => [created, ...prev]); 
    setNewReview({ rating: 0, comment: "" });
    setHoveredRating(0);
  };

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${
            activeTab === "description" ? "active" : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${
            activeTab === "reviews" ? "active" : "fade"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </div>
      </div>

      {activeTab === "description" ? (
        <div
          className="descriptionbox-description"
          dangerouslySetInnerHTML={{ __html: fullDescription }}
        />
      ) : (
        <div className="descriptionbox-description">
          {!user ? (
            <div className="review-login-required">
              <p>You must be logged in to write a review.</p>
              <Link to="/login" state={{ from: location.pathname }}>
                <button>Login to continue</button>
              </Link>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <h4>Leave a Review</h4>

              <div className="review-author">
                <input value={displayName} readOnly />
              </div>

              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= (hoveredRating || newReview.rating)
                        ? star_icon
                        : star_dull_icon
                    }
                    alt="star"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={
                      () => setNewReview({ ...newReview, rating: star }) 
                    }
                  />
                ))}
                {(hoveredRating > 0 || newReview.rating > 0) && (
                  <span
                    className="star-tooltip"
                    style={{
                      color:
                        starLabels[(hoveredRating || newReview.rating) - 1]
                          .color,
                    }}
                  >
                    {starLabels[(hoveredRating || newReview.rating) - 1].emoji}{" "}
                    {starLabels[(hoveredRating || newReview.rating) - 1].text}
                  </span>
                )}
              </div>

              <textarea
                name="comment"
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={handleInputChange}
                required
                minLength={10}
              />

              <button
                type="submit"
                disabled={!newReview.rating || !newReview.comment.trim()}
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="review-list">
            {reviews.map((review, idx) => (
              <div
                key={`${review.createdAt || idx}-${review.name}`} 
                className="review-item"
              >
                <h5>
                  {review.name}
                  <span>
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={i < review.rating ? star_icon : star_dull_icon}
                        alt=""
                        style={{ width: "16px", marginLeft: "4px" }}
                      />
                    ))}
                  </span>
                </h5>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionBox;
