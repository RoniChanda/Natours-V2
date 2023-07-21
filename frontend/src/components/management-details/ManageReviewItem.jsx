import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import IconRating from "../ui/IconRating";
import { convertDate } from "../../utils/date";
import ReviewModal from "../shared/ReviewModal";
import { useDeleteReviewMutation } from "../../redux/apis/reviewApi";
import Modal from "../ui/Modal";
import Actions from "./Actions";
import { setAlert } from "../../redux/slices/userSlice";
import "./ManageReviewItem.css";

export default function ManageReviewItem({ reviewObj }) {
  const [modal, setModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const dispatch = useDispatch();
  const [deleteReview, { isLoading, error, isSuccess }] =
    useDeleteReviewMutation();
  const { user, tour, review } = reviewObj;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (isSuccess)
      dispatch(setAlert({ type: "success", msg: "Review was deleted." }));
  }, [error, dispatch, isSuccess]);

  return (
    <Fragment>
      {modal && (
        <Modal
          heading="Delete Review"
          message={`Do you want to delete this review?`}
          onProceed={() => deleteReview(reviewObj._id)}
          onCancel={() => setModal(false)}
          isLoading={isLoading}
          headerClass="heading-warning"
        />
      )}

      {reviewModal && (
        <ReviewModal
          reviewObj={reviewObj}
          tour={tour}
          tourStartDate={reviewObj.booking?.tourStartDate}
          onCancel={() => setReviewModal(false)}
          setReviewModal={setReviewModal}
        />
      )}

      <div className="reviews-table-grid">
        <div className="table-img-item">
          <img className="manage-user-img" src={user.photo} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p>Reviewed on {convertDate(reviewObj.createdAt, true)}</p>
          </div>
        </div>

        <div className="table-img-item">
          <img
            className="manage-tour-img"
            src={tour.imageCover}
            alt={tour.name}
          />
          <div>
            <h3>{tour.name}</h3>
            <IconRating rating={reviewObj.rating} />
          </div>
        </div>

        <Actions
          onEdit={() => setReviewModal(true)}
          onDelete={() => setModal(true)}
        />
      </div>

      <p className="manage-review-text">
        {review.length > 200 ? (
          <Fragment>
            {readMore ? review : review.slice(0, 200)}
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
    </Fragment>
  );
}
