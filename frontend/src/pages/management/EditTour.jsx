import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

import InnerContainer from "../../components/ui/InnerContainer";
import UserContainer from "../../components/ui/UserContainer";
import TourDetailsInputs from "../../components/management-details/TourDetailsInputs";
import TourStartDatesInputs from "../../components/management-details/TourStartDatesInputs";
import TourStartLocationInputs from "../../components/management-details/TourStartLocationInputs";
import TourLocationsInputs from "../../components/management-details/TourLocationsInputs";
import TourImages from "../../components/management-details/TourImages";
import {
  useFetchTourDetailsQuery,
  useUpdateTourMutation,
} from "../../redux/apis/tourApi";
import TourGuidesInputs from "../../components/management-details/TourGuidesInputs";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";
import Meta from "../../components/ui/Meta";
import "./CreateTour.css";

export default function EditTour() {
  const [tourData, setTourData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
    imageCover: "",
  });
  const [startDates, setStartDates] = useState([]);
  const [startLocation, setStartLocation] = useState({
    startLocDesc: "",
    startLocLat: "",
    startLocLong: "",
    startLocAddress: "",
  });
  const [locations, setLocations] = useState([]);
  const [images, setImages] = useState([]);
  const [leadGuide, setLeadGuide] = useState("");
  const [tourGuides, setTourGuides] = useState([]);
  const { id } = useParams();
  const {
    isLoading: fetchLoading,
    error: fetchError,
    data: fetchData,
  } = useFetchTourDetailsQuery(id);
  const [
    updateTour,
    { isLoading: updateLoading, error: updateError, data: updateData },
  ] = useUpdateTourMutation();

  useLayoutEffect(() => {
    if (fetchData) {
      const tour = fetchData.data.tour;
      setTourData({
        name: tour.name,
        duration: tour.duration,
        maxGroupSize: tour.maxGroupSize,
        difficulty: tour.difficulty,
        description: tour.description,
        summary: tour.summary,
        price: tour.price,
        priceDiscount: tour.priceDiscount,
        imageCover: tour.imageCover,
      });

      setStartDates(tour.startDates);
      setLocations(tour.locations);
      setImages(tour.images);
      setLeadGuide(tour.guides[0]._id);

      const guidesId = tour.guides.slice(1).map((el) => el._id);
      setTourGuides(guidesId);

      const startLoc = tour.startLocation;
      setStartLocation({
        startLocDesc: startLoc.description,
        startLocLat: startLoc.coordinates[1],
        startLocLong: startLoc.coordinates[0],
        startLocAddress: startLoc.address,
      });
    }
  }, [fetchData]);

  console.log(locations);

  const submitHandler = (e) => {
    e.preventDefault();

    const newStartLocation = {
      description: startLocation.startLocDesc,
      coordinates: [startLocation.startLocLong, startLocation.startLocLat],
      address: startLocation.startLocAddress,
    };
    const guides = [leadGuide, ...tourGuides];

    const form = new FormData();
    Object.keys(tourData).forEach((el) => form.append(el, tourData[el]));
    form.append("startLocation", JSON.stringify(newStartLocation));
    images.forEach((el) => form.append(`images`, el));
    startDates.forEach((el) => form.append("startDates", JSON.stringify(el)));
    locations.forEach((el) => form.append("locations", JSON.stringify(el)));
    guides.forEach((el) => form.append("guides", el));

    updateTour({ tourId: id, form });
  };

  let alert;
  if (updateError) {
    alert = (
      <Alert
        type="error"
        msg={updateError.data?.message || updateError.error}
      />
    );
  } else if (updateData?.status === "SUCCESS") {
    alert = <Alert type="success" msg="Tour updated Successfully!" />;
  }

  let content;
  if (fetchLoading) {
    content = <Loader />;
  } else if (fetchError) {
    content = (
      <Alert type="error" msg={fetchError.data?.message || fetchError.error} />
    );
  } else {
    content = (
      <form className="form-create-tour" onSubmit={submitHandler}>
        <TourDetailsInputs tourData={tourData} setTourData={setTourData} />
        <div className="line span-all-columns line-small">&nbsp;</div>
        {/* Start Dates */}
        <TourStartDatesInputs
          startDates={startDates}
          setStartDates={setStartDates}
        />
        <div className="line span-all-columns line-small">&nbsp;</div>
        {/* Start Location */}
        <TourStartLocationInputs
          startLocation={startLocation}
          setStartLocation={setStartLocation}
        />
        <div className="line span-all-columns line-small">&nbsp;</div>
        {/* Locations */}
        <TourLocationsInputs
          locations={locations}
          setLocations={setLocations}
        />
        <div className="line span-all-columns line-small">&nbsp;</div>
        {/* Tour guides */}
        <TourGuidesInputs
          leadGuide={leadGuide}
          setLeadGuide={setLeadGuide}
          tourGuides={tourGuides}
          setTourGuides={setTourGuides}
        />
        <div className="line span-all-columns line-small">&nbsp;</div>
        {/* Images */}
        <TourImages
          tourData={tourData}
          setTourData={setTourData}
          images={images}
          setImages={setImages}
        />

        <div className="form__group right span-all-columns">
          <button
            type="submit"
            className={`btn btn--large btn--green ${
              updateLoading && "btn--loading"
            }`}
          >
            Update
          </button>
        </div>
      </form>
    );
  }

  return (
    <UserContainer backLink>
      <InnerContainer
        heading="Update tour"
        className="user-view__form-container"
      >
        {fetchData && (
          <Meta
            title={`${fetchData.data?.tour.name} | Edit`}
            description="Edit tour in Natours"
          />
        )}
        {alert}
        {content}
      </InnerContainer>
    </UserContainer>
  );
}
