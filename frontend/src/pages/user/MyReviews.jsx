import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useGetMyBookingsQuery } from "../../redux/apis/bookingApi";
import InnerContainer from "../../components/ui/InnerContainer";
import Loader from "../../components/ui/Loader";
import ReviewItem from "../../components/user-details/ReviewItem";
import { getTourStatus } from "../../utils/tourStatus";
import UserContainer from "../../components/ui/UserContainer";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function MyReviews() {
  const [page, setPage] = useState(1);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isLoading, data, error } = useGetMyBookingsQuery(
    {
      page,
      limit: 6,
      fields: "-createdAt,-price,-receipt,-tickets",
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));
  }, [error, dispatch]);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
    const bookings = data.data.bookings;

    const tourStatus = bookings.map((el) => {
      const tourOver = getTourStatus(el);
      return tourOver ? "yes" : "no";
    });

    if (!tourStatus?.includes("yes")) {
      content = <p className="no_bookings">No reviews yet</p>;
    } else {
      content = (
        <div>
          {bookings.map((el) => {
            const tourOver = getTourStatus(el);

            return (
              el.status === "paid" &&
              tourOver && (
                <Fragment key={el._id}>
                  <ReviewItem booking={el} />
                  <div className="line line-small">&nbsp;</div>
                </Fragment>
              )
            );
          })}
        </div>
      );
    }
  }

  return (
    user && (
      <UserContainer>
        <InnerContainer className="user-view__inner-container">
          <Meta
            title={`${user.name} | Reviews`}
            description="Manage your reviews"
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
