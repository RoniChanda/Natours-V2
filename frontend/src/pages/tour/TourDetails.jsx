import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import { useFetchTourDetailsQuery } from "../../redux/apis/tourApi";
import TourHeader from "../../components/tour-details/TourHeader";
import TourDescription from "../../components/tour-details/TourDescription";
import TourPictures from "../../components/tour-details/TourPictures";
import { convertDate } from "../../utils/date";
import TourCta from "../../components/tour-details/TourCta";
import TourReviews from "../../components/tour-details/TourReviews";
import TourMap from "../../components/tour-details/TourMap";
import Loader from "../../components/ui/Loader";
import Container from "../../components/ui/Container";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function TourDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading, data, error } = useFetchTourDetailsQuery(id);

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (searchParams.get("status") === "success")
      dispatch(setAlert({ type: "success", msg: `Welcome to Natours!` }));
  }, [error, dispatch, searchParams]);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
    const tour = data.data.tour;

    content = (
      <Container noMain>
        <Meta title={`${tour.name} | Natours`} description={tour.summary} />
        <TourHeader
          tour={tour}
          imageCover={tour.imageCover}
          name={tour.name}
          duration={tour.duration}
          startLocation={tour.startLocation}
        />
        <TourDescription
          startDate={convertDate(tour.startDates[0].dateValue)}
          difficulty={tour.difficulty}
          maxGroupSize={tour.maxGroupSize}
          ratingsAverage={tour.ratingsAverage}
          guides={tour.guides}
          name={tour.name}
          description={tour.description}
        />
        <TourPictures pictures={tour.images} name={tour.name} />
        {tour.locations.length > 0 && <TourMap locations={tour.locations} />}
        <TourReviews tour={tour} />
        <TourCta
          pictures={tour.images}
          duration={tour.duration}
          tourId={tour._id}
          startDates={tour.startDates}
          maxGroupSize={tour.maxGroupSize}
        />
      </Container>
    );
  }

  return <Fragment>{content}</Fragment>;
}
