import { Fragment } from "react";

import Input from "../form/Input";

export default function TourStartLocationInputs({
  startLocation,
  setStartLocation,
}) {
  const startLocationHandler = (e) => {
    setStartLocation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Fragment>
      <p className="tourform-sub-heading span-all-columns">Start Location:</p>
      <Input
        groupClass="span-all-columns"
        required
        type="text"
        name="startLocDesc"
        placeholder="Name"
        onChange={startLocationHandler}
        value={startLocation.startLocDesc}
      />
      <Input
        type="text"
        required
        name="startLocLat"
        placeholder="Latitude"
        onChange={startLocationHandler}
        value={startLocation.startLocLat}
      />
      <Input
        type="text"
        required
        name="startLocLong"
        placeholder="Longitude"
        onChange={startLocationHandler}
        value={startLocation.startLocLong}
      />
      <Input
        groupClass="span-all-columns"
        required
        type="text"
        name="startLocAddress"
        placeholder="Address"
        onChange={startLocationHandler}
        value={startLocation.startLocAddress}
      />
    </Fragment>
  );
}
