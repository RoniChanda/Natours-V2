import { Fragment, useState } from "react";

import Input from "../form/Input";
import "./TourLocationsInputs.css";

export default function TourLocationsInputs({ locations, setLocations }) {
  const [location, setLocation] = useState({
    locDesc: "",
    locDay: "",
    locLat: "",
    locLong: "",
  });

  const locationHandler = (e) => {
    setLocation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const addLocationHandler = () => {
    if (location) {
      setLocations((prevState) => [
        ...prevState,
        {
          description: location.locDesc,
          coordinates: [location.locLong, location.locLat],
          day: location.locDay,
        },
      ]);
    }
    setLocation({ locDesc: "", locLat: "", locLong: "", locDay: "" });
  };

  const deleteLocationHandler = (index) => {
    setLocations((prevState) => prevState.filter((el, i) => i !== index));
  };

  return (
    <Fragment>
      <div className="location-top span-all-columns">
        <p className="tourform-sub-heading">Tour Stops:</p>
        <button
          type="button"
          className="btn-secondary"
          onClick={addLocationHandler}
        >
          + Add Location
        </button>
      </div>
      <Input
        type="text"
        name="locDesc"
        placeholder="Name"
        onChange={locationHandler}
        value={location.locDesc}
      />
      <Input
        type="number"
        name="locDay"
        placeholder="Day Number"
        onChange={locationHandler}
        value={location.locDay}
      />
      <Input
        type="text"
        name="locLat"
        placeholder="Latitude"
        onChange={locationHandler}
        value={location.locLat}
      />
      <Input
        type="text"
        name="locLong"
        placeholder="Longitude"
        onChange={locationHandler}
        value={location.locLong}
      />

      {locations.map((el, index) => (
        <div className="location-item span-all-columns" key={index}>
          <p>
            Stop {index + 1}: Day-{el.day}, {el.description} (
            {el.coordinates[0]}, {el.coordinates[1]})
          </p>
          <button
            type="button"
            className="btn-secondary secondary--red"
            onClick={deleteLocationHandler.bind(null, index)}
          >
            Remove
          </button>
        </div>
      ))}
    </Fragment>
  );
}
