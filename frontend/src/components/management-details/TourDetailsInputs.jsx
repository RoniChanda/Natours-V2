import { Fragment } from "react";

import Input from "../form/Input";
import "./TourDetailsInputs.css";

export default function TourDetailsInputs({ setTourData, tourData }) {
  const tourDataHandler = (e) => {
    setTourData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Fragment>
      <p className="tourform-sub-heading span-all-columns">Tour Details:</p>
      <Input
        required
        name="name"
        type="text"
        placeholder="Tour Name"
        onChange={tourDataHandler}
        value={tourData.name}
      />
      <Input
        required
        name="duration"
        type="number"
        placeholder="Duration (in days)"
        min={1}
        onChange={tourDataHandler}
        value={tourData.duration}
      />
      <Input
        required
        name="maxGroupSize"
        type="number"
        placeholder="Group Size"
        min={1}
        onChange={tourDataHandler}
        value={tourData.maxGroupSize}
      />
      <div className="date_input ma-t-md">
        <svg className="icon-green icon-small icon-down booking-down">
          <use xlinkHref="/img/icons.svg#icon-chevron-down"></use>
        </svg>
        <select
          name="difficulty"
          required
          onChange={tourDataHandler}
          value={tourData.difficulty}
        >
          <option value="">LEVEL</option>
          <option value="easy">EASY</option>
          <option value="medium">MEDIUM</option>
          <option value="difficult">DIFFICULT</option>
        </select>
      </div>
      <Input
        required
        name="price"
        type="number"
        placeholder="Price ($)"
        onChange={tourDataHandler}
        value={tourData.price}
      />
      <Input
        required
        name="priceDiscount"
        type="number"
        placeholder="Discount ($)"
        onChange={tourDataHandler}
        value={tourData.priceDiscount}
      />
      <Input
        groupClass="span-all-columns"
        required
        name="summary"
        type="text"
        placeholder="Summary"
        onChange={tourDataHandler}
        value={tourData.summary}
      />
      <textarea
        className="tour-description-textarea span-all-columns ma-t-md"
        rows="10"
        name="description"
        placeholder="Description"
        onChange={tourDataHandler}
        value={tourData.description}
      />
    </Fragment>
  );
}
