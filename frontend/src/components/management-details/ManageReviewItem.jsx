import { Fragment, useState } from "react";

import IconRating from "../ui/IconRating";
import { convertDate } from "../../utils/date";
import "./ManageReviewItem.css";
import ReviewModal from "../user-details/ReviewModal";
import { useDeleteReviewMutation } from "../../redux/apis/reviewApi";
import Alert from "../ui/Alert";
import Modal from "../ui/Modal";
import Actions from "./Actions";

export default function ManageReviewItem({ reviewObj }) {
  const [modal, setModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [deleteReview, { isLoading, error }] = useDeleteReviewMutation();
  const { user, tour, review } = reviewObj;

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

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
