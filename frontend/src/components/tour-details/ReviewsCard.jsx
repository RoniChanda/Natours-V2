import IconRating from "../ui/IconRating";
import "./ReviewsCard.css";

export default function ReviewsCard({ review }) {
  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          className="reviews__avatar-img"
          src={review.user.photo}
          alt={review.user.name}
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>
      <p className="reviews__text">{review.review}</p>
      <div className="reviews__rating">
        <IconRating rating={review.rating} />
      </div>
    </div>
  );
}
