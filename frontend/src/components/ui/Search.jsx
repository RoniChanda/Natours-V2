import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Search.css";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchHandler = () => {
    navigate(`/?search=${keyword}`);
    setKeyword("");
  };

  return (
    <div className="nav__search">
      <button type="button" className="nav__search-btn" onClick={searchHandler}>
        <svg>
          <use xlinkHref="/img/icons.svg#icon-search"></use>
        </svg>
      </button>
      <input
        type="text"
        placeholder="Search tours"
        className="nav__search-input"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
      />
    </div>
  );
}
