import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Search.css";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/?search=${keyword}`);
    setKeyword("");
  };

  return (
    <div className="nav__search">
      <form onSubmit={submitHandler}>
        <button type="submit" className="nav__search-btn">
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
      </form>
    </div>
  );
}
