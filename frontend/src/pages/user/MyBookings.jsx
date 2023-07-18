import { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import InnerContainer from "../../components/ui/InnerContainer";
import { useGetMyBookingsQuery } from "../../redux/apis/bookingApi";
import BookingItem from "../../components/user-details/BookingItem";
import Loader from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import UserContainer from "../../components/ui/UserContainer";
import "./MyBookings.css";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";

export default function MyBookings() {
  const [page, setPage] = useState(1);
  const { user } = useSelector((state) => state.user);
  const { isLoading, data, error } = useGetMyBookingsQuery({ page, limit: 6 });

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
    const bookings = data.data.bookings;

    if (bookings.length === 0) {
      content = <p className="no_bookings">No bookings yet</p>;
    } else {
      content = (
        <div>
          <p className="sub-heading ma-bt-md">
            * Full refund if cancel booking before 30 days of tour
          </p>
          {bookings.map((el) => (
            <Fragment key={el._id}>
              <BookingItem booking={el} />
              <div className="line line-small">&nbsp;</div>
            </Fragment>
          ))}
        </div>
      );
    }
  }

  return (
    user && (
      <UserContainer>
        <InnerContainer className="user-view__inner-container">
          <Meta
            title={`${user.name} | Bookings`}
            description="Manage your bookings"
          />

          {content}

          {data && (
            <Paginate
              currentBtn={page}
              setCurrentBtn={setPage}
              pages={Math.ceil(data.total / 6)}
            />
          )}
        </InnerContainer>
      </UserContainer>
    )
  );
}
