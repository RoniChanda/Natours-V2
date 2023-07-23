import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import InnerContainer from "../../components/ui/InnerContainer";
import UserContainer from "../../components/ui/UserContainer";
import TourDetailsInputs from "../../components/management-details/TourDetailsInputs";
import TourStartDatesInputs from "../../components/management-details/TourStartDatesInputs";
import TourStartLocationInputs from "../../components/management-details/TourStartLocationInputs";
import TourLocationsInputs from "../../components/management-details/TourLocationsInputs";
import { useCreateTourMutation } from "../../redux/apis/tourApi";
import TourGuidesInputs from "../../components/management-details/TourGuidesInputs";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";
import "./CreateTour.css";

export default function CreateTour() {
  const [tourData, setTourData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
  });
  const [startDates, setStartDates] = useState([]);
  const [startLocation, setStartLocation] = useState({
    startLocDesc: "",
    startLocLat: "",
    startLocLong: "",
    startLocAddress: "",
  });
  const [locations, setLocations] = useState([]);
  const [leadGuide, setLeadGuide] = useState("");
  const [tourGuides, setTourGuides] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createTour, { isLoading, error, data }] = useCreateTourMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(setAlert({ type: "success", msg: "A new tour was created." }));
      navigate("/manage/tours");
    }
  }, [data, navigate, dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();

    const newStartLocation = {
      description: startLocation.startLocDesc,
      coordinates: [startLocation.startLocLong, startLocation.startLocLat],
      address: startLocation.startLocAddress,
    };
    const guides = [leadGuide, ...tourGuides];

    createTour({
      ...tourData,
      startDates,
      startLocation: newStartLocation,
      locations,
      guides,
    });
  };

  return (
    <UserContainer backLink>
      <Meta
        title={`Create Tour | Natours`}
        description="Create a tour in Natours"
      />
      <InnerContainer
        heading="Create new tour"
        className="user-view__form-container"
      >
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

          <div className="form__group right span-all-columns">
            <button
              type="submit"
              className={`btn btn--large btn--green ${
                isLoading && "btn--loading"
              }`}
            >
              Create
            </button>
          </div>
        </form>
      </InnerContainer>
    </UserContainer>
  );
}
