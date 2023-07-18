import { Fragment, useEffect, useState } from "react";

import { convertDate } from "../../utils/date";
import Modal from "../ui/Modal";
import { useCancelBookingByIdMutation } from "../../redux/apis/bookingApi";
import Alert from "../ui/Alert";
import "./ManageBookingItem.css";

export default function ManageBookingItem({ booking }) {
  const [modal, setModal] = useState(false);
  const [cancelBooking, { isLoading, error, data }] =
    useCancelBookingByIdMutation();
  const { user, tour } = booking;
  const canCancel = booking.status === "pending" || booking.status === "paid";

  useEffect(() => {
    if (data?.status === "SUCCESS") setModal(false);
  }, [data]);

  const cancelBookingHandler = () => {
    cancelBooking({ userId: user._id, bookingId: booking._id });
  };

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

      {modal && (
        <Modal
          heading="Cancel Booking"
          message={
            <>
              Do you want to cancel this booking and refund{" "}
              <span>${booking.price}</span>?
            </>
          }
          onProceed={cancelBookingHandler}
          onCancel={() => setModal(false)}
          isLoading={isLoading}
          headerClass="heading-warning"
        />
      )}

      <div className="bookings-table-grid">
        <div className="table-img-item">
          <img className="manage-user-img" src={user.photo} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p>Booked on {convertDate(booking.createdAt, true)}</p>
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
            <p>{convertDate(booking.tourStartDate, true)}</p>
          </div>
        </div>

        <div className="manage-booking-price">
          <p>${booking.price}</p>
          <p className={`manage-booking-status booking_${booking.status}`}>
            {booking.status}
          </p>
        </div>

        {canCancel && (
          <div className="actions">
            <button
              className="btn-secondary btn--xs secondary--red"
              onClick={() => setModal(true)}
            >
              <svg className="icon-delete icon-small">
                <use xlinkHref="/img/icons.svg#icon-x-square"></use>
              </svg>
              <p className="action-type">Cancel</p>
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
