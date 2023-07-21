import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import TourBooking from "./TourBooking";
import "./TourCta.css";

export default function TourCta({
  pictures,
  duration,
  tourId,
  startDates,
  maxGroupSize,
}) {
  const [booking, setBooking] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) setBooking(true);
  }, [user]);

  return (
    <section className="section-cta">
      <div className="cta">
        <div className="cta__img cta__img--logo">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <img
          className="cta__img cta__img--1"
          src={pictures[1]}
          alt="Tour-pic-1"
        />
        <img
          className="cta__img cta__img--2"
          src={pictures[2]}
          alt="Tour-pic-2"
        />
        <div className="cta__content">
          <h2 className="heading-secondary">What are you waiting for?</h2>
          <p className="cta__text">
            {duration} days. 1 adventure. Infinite memories. Make it yours
            today!
          </p>
          {user ? (
            <button
              type="button"
              className={`btn btn--medium ${
                booking ? "btn--red" : "btn--green"
              } span-all-rows`}
              onClick={() => setBooking((prevState) => !prevState)}
            >
              {booking ? "Cancel" : "Book tour"}
            </button>
          ) : (
            <Link
              to={`/auth/login?redirect=/tours/${tourId}`}
              className="btn btn--medium btn--green span-all-rows"
            >
              Book tour
            </Link>
          )}
        </div>
      </div>
      {user && (
        <TourBooking
          set={booking}
          tourId={tourId}
          startDates={startDates}
          maxGroupSize={maxGroupSize}
        />
      )}
    </section>
  );
}
