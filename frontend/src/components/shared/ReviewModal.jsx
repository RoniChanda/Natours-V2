import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { convertDate } from "../../utils/date";
import InputRating from "../form/InputRating";
import InnerContainer from "../ui/InnerContainer";
import { useUpdateReviewMutation } from "../../redux/apis/reviewApi";
import ModalContainer from "../ui/ModalContainer";
import { useCreateMyReviewMutation } from "../../redux/apis/bookingApi";
import { setAlert } from "../../redux/slices/userSlice";
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
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (reviewObj) {
      setRating(reviewObj.rating);
      setReview(reviewObj.review);
    }
  }, [reviewObj]);

  const error = createReviewError || updateReviewError;
  const isLoading = createReviewLoading || updateReviewLoading;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (createReviewData?.status === "SUCCESS") {
      setReviewModal(false);
      dispatch(setAlert({ type: "success", msg: "Thanks for your feedback!" }));
    }

    if (updateReviewData?.status === "SUCCESS") {
      setReviewModal(false);
      dispatch(setAlert({ type: "success", msg: "Review was updated." }));
    }
  }, [error, dispatch, updateReviewData, createReviewData, setReviewModal]);

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
