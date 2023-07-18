import { Fragment, useState } from "react";

import { useGetGuidesQuery } from "../../redux/apis/userApi";
import "./TourGuidesInputs.css";

export default function TourGuidesInputs({
  leadGuide,
  setLeadGuide,
  tourGuides,
  setTourGuides,
}) {
  const [otherGuide, setOtherGuide] = useState("");
  const { data } = useGetGuidesQuery();
  const leadGuides = data?.data?.guides?.filter(
    (el) => el.role === "lead-guide"
  );
  const guides = data?.data?.guides?.filter((el) => el.role === "guide");

  const addGuideHandler = () => {
    if (otherGuide) setTourGuides((prevState) => [...prevState, otherGuide]);
    setOtherGuide("");
  };

  const deleteGuideHandler = (index) => {
    setTourGuides((prevState) => prevState.filter((el, i) => i !== index));
  };

  return (
    <Fragment>
      <p className="tourform-sub-heading span-all-columns ma-bt-md">
        Tour Guides:
      </p>
      <div className="date_input ma-bt-md">
        <svg className="icon-green icon-small icon-down booking-down">
          <use xlinkHref="/img/icons.svg#icon-chevron-down"></use>
        </svg>
        <select
          name="leadGuide"
          onChange={(e) => setLeadGuide(e.target.value)}
          value={leadGuide}
        >
          <option value="">LEAD GUIDE:</option>
          {leadGuides?.map((el) => (
            <option key={el._id} value={el._id}>
              {el.name}
            </option>
          ))}
        </select>
      </div>
      <div className="other-guides">
        <div className="date_input other-guide-input">
          <svg className="icon-green icon-small icon-down booking-down">
            <use xlinkHref="/img/icons.svg#icon-chevron-down"></use>
          </svg>
          <select
            name="tourGuide"
            onChange={(e) => setOtherGuide(e.target.value)}
            value={otherGuide}
          >
            <option value="">OTHER GUIDE:</option>
            {guides?.map((el) => (
              <option key={el._id} value={el._id}>
                {el.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={addGuideHandler}
        >
          + Add guide
        </button>
      </div>

      <div>
        {tourGuides.map((el, index) => (
          <div className="guide-item" key={index}>
            <p>
              Guide {index + 1}: {guides?.find((g) => g._id === el).name}
            </p>
            <button
              type="button"
              className="btn-secondary secondary--red"
              onClick={deleteGuideHandler.bind(null, index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
