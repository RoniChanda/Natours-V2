import { Fragment, useState } from "react";

import ReviewsCard from "./ReviewsCard";
import TourReviewModal from "./TourReviewModal";
import "./TourReviews.css";

export default function TourReviews({ tour }) {
  const [modal, setModal] = useState(false);

  return (
    <section className="section-reviews">
      {tour.reviews.length > 0 ? (
        <Fragment>
          {modal && (
            <TourReviewModal tour={tour} onCancel={() => setModal(false)} />
          )}
          <div className="reviews">
            {tour.reviews?.slice(0, 3).map((review) => (
              <ReviewsCard key={review._id} review={review} />
            ))}
          </div>
          <div className="center">
            <button
              type="button"
              className="btn btn--medium btn--white"
              onClick={() => setModal(true)}
            >
              See all reviews
            </button>
          </div>
        </Fragment>
      ) : (
        <p className="no-review">No reviews yet</p>
      )}
    </section>
  );
}
