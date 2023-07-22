import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import TourCard from "../../components/tour-details/TourCard";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import InputSelect from "../../components/ui/InputSelect";
import IconFilter from "../../components/ui/IconFilter";
import OverviewFilterModal from "../../components/tour-details/OverviewFilterModal";
import Paginate from "../../components/ui/Paginate";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";
import "./Overview.css";

export default function Overview() {
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState({ difficulty: "", rating: "0" });
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("search") || "";
  const { isLoading, data, error } = useFetchAllToursQuery({
    sort,
    difficulty: filter.difficulty,
    [`ratingsAverage[gte]`]: filter.rating,
    page,
    limit: 6,
    keyword,
    fields: "-description,-guides,-reviewsCount,-images",
  });

  const inputHandler = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (searchParams.get("status") === "success")
      dispatch(setAlert({ type: "success", msg: `Welcome to Natours!` }));
  }, [error, dispatch, searchParams]);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
    const tours = data.data.tours;

    const contentBody = tours.map((tour) => (
      <TourCard key={tour._id} tour={tour} />
    ));

    content = (
      <Fragment>
        <Meta />
        <div className="overview-container">
          <div className="overview-actions">
            {modal && (
              <OverviewFilterModal
                inputHandler={inputHandler}
                onCancel={() => setModal(false)}
                filter={filter}
              />
            )}
            <div className="manage-queries">
              <p>Total: {data.total}</p>
              <p>
                Page: {page} ({data.results} results)
              </p>
              {keyword && <p>Search results for &quot;{keyword}&quot;</p>}
            </div>
            <div className="manage-queries">
              <IconFilter filter={filter} onClick={() => setModal(true)} />
              <InputSelect
                type="sort"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Newest</option>
                <option value="price">Price Low to High</option>
                <option value="-price">Price High to Low</option>
                <option value="ratingsAverage">Rating Low to High</option>
                <option value="-ratingsAverage">Rating High to Low</option>
                <option value="-ratingsQuantity">More Reviews</option>
              </InputSelect>
            </div>
          </div>
          <div className="card-container">{contentBody}</div>
          <Paginate
            currentBtn={page}
            setCurrentBtn={setPage}
            pages={Math.ceil(data.total / 6)}
            filter={filter}
            sort={sort}
            keyword={keyword}
          />
        </div>
        <Footer />
      </Fragment>
    );
  }

  return content;
}
