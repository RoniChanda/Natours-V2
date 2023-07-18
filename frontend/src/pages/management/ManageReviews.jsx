import { Fragment, useState } from "react";

import Alert from "../../components/ui/Alert";
import InnerContainer from "../../components/ui/InnerContainer";
import Loader from "../../components/ui/Loader";
import UserContainer from "../../components/ui/UserContainer";
import { useGetAllReviewsQuery } from "../../redux/apis/reviewApi";
import ManageReviewItem from "../../components/management-details/ManageReviewItem";
import IconFilter from "../../components/ui/IconFilter";
import InputSelect from "../../components/ui/InputSelect";
import ReviewFilterModal from "../../components/management-details/ReviewFilterModal";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";

export default function ManageReviews() {
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState({ tour: "", rating: "" });
  const [page, setPage] = useState(1);

  const { isLoading, error, data } = useGetAllReviewsQuery({
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
    const allReviews = data.data.reviews;

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
              <option value="-rating">Rating High to Low</option>
              <option value="rating">Rating Low to High</option>
            </InputSelect>
          </div>
        </div>

        <div className="table-header reviews-table-grid">
          <p>User</p>
          <p>Tour</p>
          <p>Actions</p>
        </div>
        <div className="line line-xs">&nbsp;</div>

        {allReviews.length > 0 ? (
          allReviews.map((el) => (
            <Fragment key={el._id}>
              <ManageReviewItem reviewObj={el} />
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
          title="Manage reviews | Natours"
          description="Edit and delete reviews in Natours"
        />

        {modal && (
          <ReviewFilterModal
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
