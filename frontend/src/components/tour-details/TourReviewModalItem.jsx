import { Fragment, useEffect, useState } from "react";

import { convertDate } from "../../utils/date";
import IconRating from "../ui/IconRating";
import { useProvideFeedbackMutation } from "../../redux/apis/reviewApi";
import Alert from "../ui/Alert";
import "./TourReviewModalItem.css";
import Loader from "../ui/Loader";

export default function ReviewModalItem({ reviewObj, tourStartDate }) {
  const [readMore, setReadMore] = useState(false);
  const [like, setLike] = useState(false);
  const [unlike, setUnlike] = useState(false);
  const { user, createdAt, review, rating } = reviewObj;
  const [provideFeedback, { isLoading, error, data }] =
    useProvideFeedbackMutation();

  useEffect(() => {
    const feedback = reviewObj.userFeedback?.[0]?.feedback;

    if (feedback === "like") setLike(true);
    if (feedback === "unlike") setUnlike(true);
  }, [reviewObj]);

  useEffect(() => {
    if (error) {
      setLike(false);
      setUnlike(false);
    }
  }, [error]);

  const likeHandler = () => {
    provideFeedback({ reviewId: reviewObj._id, feedback: !like && "like" });
    setLike((prevState) => !prevState);
    setUnlike(false);
  };
  const unlikeHandler = () => {
    provideFeedback({ reviewId: reviewObj._id, feedback: !unlike && "unlike" });
    setUnlike((prevState) => !prevState);
    setLike(false);
  };

  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (data?.feedback) {
    alert = <Alert type="success" msg="Thanks for your feedback!" />;
  }

  return (
    <Fragment>
      {alert}

      <div className="review-modal-item">
        <img src={user.photo} alt={user.name} className="item_user_photo" />
        <div className="review-modal-user">
          <h3>{user.name}</h3>
          <p>Reviewed: {convertDate(createdAt)}</p>
        </div>
        <div className="review-modal-booking">
          <IconRating rating={rating} />
          <p>Tour Date: {convertDate(tourStartDate)}</p>
        </div>
      </div>

      {review && (
        <p className="review-modal-review">
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
      <p className="liked_text">
        {reviewObj.likeCount > 0 &&
          `${reviewObj.likeCount} people found this helpful`}
      </p>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="btn-likes-container">
          <button className="btn-likes" onClick={likeHandler}>
            <svg className={`icon-small icon-${like ? "green" : "dark"}`}>
              <use xlinkHref="/img/icons.svg#icon-thumbs-up"></use>
            </svg>
          </button>
          <button className="btn-likes" onClick={unlikeHandler}>
            <svg className={`icon-small icon-${unlike ? "red" : "dark"}`}>
              <use xlinkHref="/img/icons.svg#icon-thumbs-down"></use>
            </svg>
          </button>
        </div>
      )}
    </Fragment>
  );
}
