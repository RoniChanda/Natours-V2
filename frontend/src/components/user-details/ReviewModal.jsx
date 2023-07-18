import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { convertDate } from "../../utils/date";
import InputRating from "../form/InputRating";
import InnerContainer from "../ui/InnerContainer";
import { useUpdateReviewMutation } from "../../redux/apis/reviewApi";
import Alert from "../ui/Alert";
import ModalContainer from "../ui/ModalContainer";
import { useCreateMyReviewMutation } from "../../redux/apis/bookingApi";
import "./ReviewModal.css";

export default function ReviewModal({
  bookingId,
  reviewObj,
  tour,
  tourStartDate,
  onCancel,
  setReviewModal,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [
    createReview,
    {
      isLoading: createReviewLoading,
      error: createReviewError,
      data: createReviewData,
    },
  ] = useCreateMyReviewMutation();
  const [
    updateReview,
    {
      isLoading: updateReviewLoading,
      error: updateReviewError,
      data: updateReviewData,
    },
  ] = useUpdateReviewMutation();

  const data = createReviewData || updateReviewData;
  const error = createReviewError || updateReviewError;
  const isLoading = createReviewLoading || updateReviewLoading;

  useEffect(() => {
    if (reviewObj) {
      setRating(reviewObj.rating);
      setReview(reviewObj.review);
    }
  }, [reviewObj]);

  useEffect(() => {
    if (data?.status === "SUCCESS") setReviewModal(false);
  }, [data, setReviewModal]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = { review, rating };
    if (reviewObj) {
      updateReview({ reviewId: reviewObj._id, formData });
    } else {
      createReview({ bookingId, formData });
    }
  };

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

      <ModalContainer>
        <InnerContainer
          className="form-modal"
          heading={`${reviewObj ? "Update" : "Write"} Review`}
        >
          <form onSubmit={submitHandler}>
            <div className="review_tour_details">
              <img
                className="review_tour_image"
                src={tour.imageCover}
                alt={tour.name}
              />
              <div className="review_tour_description">
                <h3>
                  <Link to={`/tours/${tour._id}`} className="review_tour_link">
                    {tour.name}
                  </Link>
                </h3>
                <p>You visited on {convertDate(tourStartDate, true)}</p>

                <InputRating
                  rating={rating}
                  setRating={setRating}
                  reviewObj={reviewObj}
                />
              </div>
            </div>
            <div className="review_text_container">
              <textarea
                autoFocus
                className="review_text"
                name="review"
                cols="57"
                rows="10"
                placeholder="Tell us about your trip . . . ."
                onChange={(e) => setReview(e.target.value)}
                value={review}
              />
            </div>
            <div className="form__group right">
              <button
                type="button"
                className="btn btn--small btn--red ma-r-sm"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`btn btn--small btn--green ${
                  isLoading && "btn--loading"
                }`}
              >
                {reviewObj ? "Update" : "Post"}
              </button>
            </div>
          </form>
        </InnerContainer>
      </ModalContainer>
    </Fragment>
  );
}
