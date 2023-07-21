import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useCheckoutMutation } from "../../redux/apis/bookingApi";
import ButtonAuth from "../form/ButtonAuth";
import { convertDate } from "../../utils/date";
import { setAlert } from "../../redux/slices/userSlice";
import "./TourBooking.css";

export default function TourBooking({ set, tourId, startDates, maxGroupSize }) {
  const [date, setDate] = useState("");
  const [tickets, setTickets] = useState();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");
  const [checkout, { isLoading, data, error }] = useCheckoutMutation();

  useEffect(() => {
    if (data?.session?.url) {
      window.location.href = data.session.url;
    }
  }, [data]);

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (paymentStatus === "failed")
      dispatch(setAlert({ type: "error", msg: "Booking failed!" }));
  }, [error, dispatch, paymentStatus]);

  const dateHandler = (e) => {
    setDate(e.target.value);
    setTickets(1);
  };

  const incrementHandler = () => {
    const maximumValue = Number(
      maxGroupSize - startDates.find((el) => el.dateValue === date).participants
    );
    if (tickets < maximumValue) setTickets((prevState) => prevState + 1);
  };
  const decrementHandler = () => {
    if (tickets > 1) setTickets((prevState) => prevState - 1);
  };

  const bookingHandler = (e) => {
    e.preventDefault();
    const formData = { date, tickets };
    checkout({ tourId, formData });
  };

  return (
    <div className={`tour_booking ${set && "set-tour_booking"}`}>
      <div className={`tour_dates ${set && "set-tour_dates"}`}>
        <div className="dates_container">
          <h3>Available Dates</h3>
          {startDates?.map((el) => (
            <p key={el._id}>{convertDate(el.dateValue, true)}</p>
          ))}
        </div>

        <div className="dates_container">
          <h3>Tickets Available</h3>
          {startDates?.map((el) => (
            <p key={el._id}>{maxGroupSize - el.participants}</p>
          ))}
        </div>

        <div className="vertical-line">&nbsp;</div>

        <form onSubmit={bookingHandler} className="form_booking">
          <div className="date_input">
            <svg className="icon-green icon-small icon-down booking-down">
              <use xlinkHref="/img/icons.svg#icon-chevron-down"></use>
            </svg>
            <select name="date" onChange={dateHandler}>
              <option value="">CHOOSE DATE:</option>
              {startDates?.map((el) => (
                <option key={el._id} value={el.dateValue}>
                  {convertDate(el.dateValue, true)}
                </option>
              ))}
            </select>
          </div>

          {date && (
            <div className="booking_tickets">
              <button type="button" onClick={decrementHandler}>
                -
              </button>
              <p>{tickets}</p>
              <button type="button" onClick={incrementHandler}>
                +
              </button>
            </div>
          )}
          <ButtonAuth isLoading={isLoading}>Book</ButtonAuth>
        </form>
      </div>
    </div>
  );
}
