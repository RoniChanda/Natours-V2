import { Link } from "react-router-dom";

import { convertDate } from "../../utils/date";
import "./TourCard.css";

export default function TourCard({ tour }) {
  return (
    <div className="card">
      <div className="card__header">
        {tour.discountPercent && (
          <div className="card__discount">
            {Math.round(tour.discountPercent)}% off
          </div>
        )}
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            src={tour.imageCover}
            alt={tour.name}
            className="card__picture-img"
          />
        </div>
        <Link to={`/tours/${tour._id}`}>
          <h3 className="heading-tertirary">
            <span>{tour.name}</span>
          </h3>
        </Link>
      </div>
      <div className="card__details">
        <h4 className="card__sub-heading">
          {tour.difficulty + " "}
          {tour.duration}-day tour
        </h4>
        <p className="card__text">{tour.summary}</p>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-map-pin"></use>
          </svg>
          <span>{tour.startLocation.description}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-calendar"></use>
          </svg>
          <span>{convertDate(tour.startDates[0].dateValue)}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-flag"></use>
          </svg>
          <span>{tour.locations.length} stops</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use xlinkHref="img/icons.svg#icon-user"></use>
          </svg>
          <span>{tour.maxGroupSize} people</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span
            className={`card__footer-value ${
              tour.priceDiscount && "card-discount"
            }`}
          >
            ${tour.price}
          </span>
          {tour.priceDiscount && (
            <span className="card__footer-value">
              ${tour.price - tour.priceDiscount}
            </span>
          )}
          <span className="card__footer-text"> per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{tour.ratingsAverage}</span>
          <span className="card__footer-text">
            {" "}
            rating ({tour.ratingsQuantity})
          </span>
        </p>
        <Link to={`/tours/${tour._id}`} className="btn btn--green btn--small">
          Details
        </Link>
      </div>
    </div>
  );
}
