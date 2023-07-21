import { useEffect, useState } from "react";

import "./IconFilter.css";

export default function Filter({ onClick, filter }) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const filterArr = Object.keys(filter).filter(
      (el) => filter[el] !== "" && filter[el] !== "0"
    );
    setSelected(filterArr.length);
  }, [filter]);

  return (
    <div className="filter" onClick={onClick}>
      <p>Filter:</p>
      {selected ? (
        <p className="filter-selected">{selected}</p>
      ) : (
        <svg className="icon-small icon-back">
          <use xlinkHref="/img/icons.svg#icon-filter"></use>
        </svg>
      )}
    </div>
  );
}
