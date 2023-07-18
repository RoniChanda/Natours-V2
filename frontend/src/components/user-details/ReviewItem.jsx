import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { convertDate } from "../../utils/date";
import IconRating from "../ui/IconRating";
import ReviewModal from "./ReviewModal";
import { useDeleteReviewMutation } from "../../redux/apis/reviewApi";
import Alert from "../ui/Alert";
import "./ReviewItem.css";

export default function ReviewItem({ booking }) {
  const [reviewModal, setReviewModal] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [deleteReview, { isLoading, error }] = useDeleteReviewMutation();
  const review = booking.review[0]?.review;
  const likeCount = booking.review[0]?.likeCount;
  const rating = booking.review[0]?.rating;

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

      {reviewModal && (
        <ReviewModal
          bookingId={booking._id}
          reviewObj={booking.review[0]}
          tour={booking.tour}
          tourStartDate={booking.tourStartDate}
          onCancel={() => setReviewModal(false)}
          setReviewModal={setReviewModal}
        />
      )}

      <div className="review_tour_details">
        <img
          src={booking.tour.imageCover}
          alt={booking.tour.name}
          className="review_tour_image"
        />
        <div className="review_tour_description">
          <h3>
            <Link
              to={`/tours/${booking.tour._id}`}
              className="review_tour_link"
            >
              {booking.tour.name}
            </Link>
          </h3>
          <p className="ma-bt-sm">
            You visited on {convertDate(booking.tourStartDate, true)}
          </p>

          <IconRating rating={rating} className="icon-rating" />
        </div>
        <div className="review_links">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setReviewModal(true)}
          >
            {review ? "Update" : "Write"} Review
          </button>

          {review && (
            <button
              className="btn-secondary secondary--red"
              onClick={() => deleteReview(booking.review[0]._id)}
            >
              {isLoading ? "Loading..." : "Delete Review"}
            </button>
          )}
        </div>
      </div>
      {review && (
        <p className="reviews__text">
          {review.length > 300 ? (
            <Fragment>
              {readMore ? review : review.slice(0, 300)}
              <span
                className="read-more"
                onClick={() => setReadMore((prevState) => !prevState)}
              >
                {readMore ? " show less" : " read more"}
              </span>
            </Fragment>
          ) : (
            review
          )}
        </p>
      )}
      {likeCount > 0 && (
        <p className="liked_text">{likeCount} people found this helpful</p>
      )}
    </Fragment>
  );
}
