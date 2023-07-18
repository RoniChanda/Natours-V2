import { useState } from "react";

import Input from "../form/Input";
import { convertDate } from "../../utils/date";
import "./TourStartDatesInputs.css";

export default function TourStartDatesInputs({ startDates, setStartDates }) {
  const [date, setDate] = useState("");

  const addDateHandler = () => {
    if (date) setStartDates((prevState) => [...prevState, { dateValue: date }]);
    setDate("");
  };

  const deleteDateHandler = (index) => {
    setStartDates((prevState) => prevState.filter((el, i) => i !== index));
  };

  return (
    <div className="start-date-container span-all-columns">
      <p className="tourform-sub-heading">Start Dates:</p>
      <Input
        groupClass="ma-t-no"
        name="startDate"
        type="date"
        onChange={(e) => setDate(e.target.value)}
        value={date}
      />
      <button type="button" className="btn-secondary" onClick={addDateHandler}>
        + Add Date
      </button>
      <div className="dates-preview">
        {startDates.map((el, index) => (
          <div className="date-item" key={index}>
            <p>
              Date {index + 1}: {convertDate(el.dateValue, true)}
            </p>
            <button
              type="button"
              className="btn-secondary secondary--red"
              onClick={deleteDateHandler.bind(null, index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
