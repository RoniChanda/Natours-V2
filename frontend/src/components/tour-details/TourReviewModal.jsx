import { Fragment, useState } from "react";

import { useFetchTourReviewsQuery } from "../../redux/apis/tourApi";
import Alert from "../ui/Alert";
import InnerContainer from "../ui/InnerContainer";
import Loader from "../ui/Loader";
import ModalContainer from "../ui/ModalContainer";
import TourReviewModalItem from "./TourReviewModalItem";
import RatingsDetail from "./RatingsDetail";
import "./TourReviewModal.css";

export default function TourReviewModal({ tour, onCancel }) {
  const [rating, setRating] = useState("");
  const { isLoading, error, data } = useFetchTourReviewsQuery({
    tourId: tour._id,
    rating,
  });

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
    const reviews = data.data.reviews;

    content = (
      <div className="modal-inner-container">
        <RatingsDetail
          tour={tour}
          onChange={(e) => setRating(e.target.value)}
        />
        {reviews.map((el) => (
          <Fragment key={el._id}>
            <TourReviewModalItem
              reviewObj={el}
              tourStartDate={el.booking?.tourStartDate}
            />
            <div className="line line-small">&nbsp;</div>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <ModalContainer onCancel={onCancel}>
      <InnerContainer
        heading={tour.name}
        className="review-modal modal-outer-container"
      >
        {content}
      </InnerContainer>
    </ModalContainer>
  );
}
