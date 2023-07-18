import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TourCard from "../../components/tour-details/TourCard";
import { useFetchAllToursQuery } from "../../redux/apis/tourApi";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";
import Footer from "../../components/layout/Footer";
import InputSelect from "../../components/ui/InputSelect";
import IconFilter from "../../components/ui/IconFilter";
import OverviewFilterModal from "../../components/tour-details/OverviewFilterModal";
import Paginate from "../../components/ui/Paginate";
import "./Overview.css";
import Meta from "../../components/ui/Meta";

export default function Overview() {
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState({ difficulty: "", rating: "0" });
  const [page, setPage] = useState(1);
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

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
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
          />
        </div>
        <Footer />
      </Fragment>
    );
  }

  return content;
}