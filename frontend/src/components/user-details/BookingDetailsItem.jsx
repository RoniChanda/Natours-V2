import "./BookingDetailsItem.css";

export default function BookingDetailsItem({ name, value }) {
  return (
    <div className="bd-container">
      <svg className="icon-green icon-small">
        <use xlinkHref="/img/icons.svg#icon-chevron-right"></use>
      </svg>
      <p>
        <span>{name}:</span> {value}
      </p>
    </div>
  );
}
