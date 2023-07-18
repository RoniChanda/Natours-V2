import { Fragment, useState } from "react";

import InnerContainer from "../../components/ui/InnerContainer";
import UserContainer from "../../components/ui/UserContainer";
import Alert from "../../components/ui/Alert";
import { useGetAllBookingsQuery } from "../../redux/apis/bookingApi";
import Loader from "../../components/ui/Loader";
import ManageBookingItem from "../../components/management-details/ManageBookingItem";
import InputSelect from "../../components/ui/InputSelect";
import IconFilter from "../../components/ui/IconFilter";
import BookingFilterModal from "../../components/management-details/BookingFilterModal";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";

export default function ManageBookings() {
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState({ tour: "", status: "" });
  const [page, setPage] = useState(1);

  const { isLoading, data, error } = useGetAllBookingsQuery({
    sort,
    ...filter,
    page,
    limit: 8,
  });

  const inputHandler = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
    const allBookings = data.data.bookings;

    content = (
      <div>
        <div className="manage-top">
          <div className="manage-queries">
            <p>Total: {data.total}</p>
            <p>
              Page: {page} ({data.results} results)
            </p>
          </div>
          <div className="manage-queries">
            <IconFilter filter={filter} onClick={() => setModal(true)} />
            <InputSelect type="sort" onChange={(e) => setSort(e.target.value)}>
              <option value="">Newest</option>
              <option value="-price">Price High to Low</option>
              <option value="price">Rating Low to High</option>
            </InputSelect>
          </div>
        </div>

        <div className="table-header bookings-table-grid">
          <p>User</p>
          <p>Tour</p>
          <p>Payment</p>
          <p>Actions</p>
        </div>
        <div className="line line-xs">&nbsp;</div>

        {allBookings.length > 0 ? (
          allBookings.map((el) => (
            <Fragment key={el._id}>
              <ManageBookingItem booking={el} />
              <div className="line line-xs">&nbsp;</div>
            </Fragment>
          ))
        ) : (
          <p style={{ fontSize: "1.6rem" }}>No results</p>
        )}
      </div>
    );
  }
  return (
    <UserContainer>
      <InnerContainer className="manage-view__inner-container">
        <Meta
          title="Manage bookings | Natours"
          description="View, cancel and refund bookings in Natours"
        />

        {modal && (
          <BookingFilterModal
            inputHandler={inputHandler}
            onCancel={() => setModal(false)}
            filter={filter}
          />
        )}

        {content}
        {data && (
          <Paginate
            currentBtn={page}
            setCurrentBtn={setPage}
            pages={Math.ceil(data?.total / 8)}
            filter={filter}
            sort={sort}
          />
        )}
      </InnerContainer>
    </UserContainer>
  );
}
