export default function IconRating({ rating, className }) {
  return [1, 2, 3, 4, 5].map((star) => (
    <svg
      key={star}
      className={`icon-small ${className || undefined} ${
        star <= rating ? `icon-color-${rating}` : "icon-inactive"
      }`}
    >
      <use xlinkHref="/img/icons.svg#icon-star"></use>
    </svg>
  ));
}
