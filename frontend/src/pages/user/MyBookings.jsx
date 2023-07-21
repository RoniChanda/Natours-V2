import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import InnerContainer from "../../components/ui/InnerContainer";
import { useGetMyBookingsQuery } from "../../redux/apis/bookingApi";
import BookingItem from "../../components/user-details/BookingItem";
import Loader from "../../components/ui/Loader";
import UserContainer from "../../components/ui/UserContainer";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";
import "./MyBookings.css";

export default function MyBookings() {
  const [page, setPage] = useState(1);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");
  const { isLoading, data, error } = useGetMyBookingsQuery(
    { page, limit: 6 },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (paymentStatus === "success")
      dispatch(
        setAlert({ type: "success", msg: "Your booking was successful." })
      );
  }, [error, dispatch, paymentStatus]);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
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
