import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { convertDate } from "../../utils/date";
import { useCancelMyBookingMutation } from "../../redux/apis/bookingApi";
import BookingDetailsItem from "./BookingDetailsItem";
import Modal from "../ui/Modal";
import { setAlert } from "../../redux/slices/userSlice";
import "./BookingItem.css";

export default function BookingItem({ booking }) {
  const [modal, setModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const [cancelBooking, { isLoading, error, data }] =
    useCancelMyBookingMutation();

  const showLinks = booking.status === "paid";
  const startDate = new Date(booking.tourStartDate).getTime();
  let daysRemaining;
  if (Date.now() > startDate + booking.tour.duration * 24 * 60 * 60 * 1000) {
    daysRemaining = "Tour over";
  } else if (Date.now() > startDate) {
    daysRemaining = "Ongoing";
  } else {
    daysRemaining = Math.ceil((startDate - Date.now()) / (24 * 60 * 60 * 1000));
  }

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(setAlert({ type: "success", msg: "Booking was canceled." }));
      setModal(false);
    }
  }, [data, dispatch, error]);

  return (
    <Fragment>
      {modal && (
        <Modal
          onProceed={() => cancelBooking(booking._id)}
          onCancel={() => setModal(false)}
          isLoading={isLoading}
          heading="cancel booking"
          headerClass="heading-warning"
          message={
            <>
              This action is irreversible. Do you want to cancel this booking (
              <span>{`${daysRemaining > 30 ? "" : "Non-"}Refundable`}</span>)?
            </>
          }
        />
      )}

      <div className="review_tour_details">
        <img
          src={booking.tour.imageCover}
          alt={booking.tour.name}
          className="review_tour_image"
        />
        <div className="review_tour_description">
          <h3>
            <Link
              to={`/tours/${booking.tour._id}`}
              className="review_tour_link"
            >
              {booking.tour.name}
            </Link>
          </h3>
          <p className="ma-bt-sm">
            You booked on {convertDate(booking.tourStartDate, true)}
          </p>
          <p className="booking-price">
            Total: ${booking.price}{" "}
            <span className={`booking_status booking_${booking.status}`}>
              {booking.status}
            </span>
          </p>
        </div>

        {showLinks && (
          <div className="review_links">
            {booking.receipt && (
              <Link
                className="btn-secondary"
                to={booking.receipt}
                target="_blank"
              >
                View Receipt
              </Link>
            )}

            {startDate - Date.now() > 0 && (
              <button
              type="button"
                className="btn-secondary secondary--red"
                onClick={() => setModal(true)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>

      {showMore && (
        <div className="booking-status-container">
          <BookingDetailsItem
            name="Start date"
            value={convertDate(booking.tourStartDate, true)}
          />
          <BookingDetailsItem
            name="Tickets"
            value={`${booking.tickets} ($${booking.tour.price} per person)`}
          />
          <BookingDetailsItem
            name="Tour Status"
            value={`${daysRemaining}${
              isNaN(daysRemaining) ? "" : " days remaining"
            } `}
          />
          <BookingDetailsItem
            name="Refundable"
            value={daysRemaining > 30 ? "Yes" : "No"}
          />
        </div>
      )}

      <span
        className="read-more"
        onClick={() => setShowMore((prevState) => !prevState)}
      >
        {showMore ? "Show Less" : "Show Details"}
      </span>
    </Fragment>
  );
}
