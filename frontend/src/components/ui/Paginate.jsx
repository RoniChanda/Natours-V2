import { useEffect, useState } from "react";

import "./Paginate.css";

export default function Paginate({
  type,
  pages,
  currentBtn,
  setCurrentBtn,
  filter,
  sort,
  keyword,
}) {
  const [arrCurrentBtns, setArrCurrentBtns] = useState([]);

  useEffect(() => {
    if (filter || sort || keyword) setCurrentBtn(1);
  }, [filter, sort, keyword, setCurrentBtn]);

  // Page number showing functionality
  useEffect(() => {
    const numberOfPages = [];
    for (let i = 1; i <= pages; i++) {
      numberOfPages.push(i);
    }

    let tempNumPages = [...numberOfPages].slice(0, 5);
    if (currentBtn >= 5) {
      let sliced;
      if (currentBtn >= numberOfPages.length - 2) {
        sliced = numberOfPages.slice(numberOfPages.length - 4);
      } else {
        sliced = numberOfPages.slice(currentBtn - 2, currentBtn + 1);
      }
      tempNumPages = ["1", "...", ...sliced];
    }
    setArrCurrentBtns(tempNumPages);
  }, [currentBtn, pages]);

  const prevBtnHandler = () => {
    setCurrentBtn((prevState) => (prevState === 1 ? prevState : prevState - 1));
  };
  const nextBtnHandler = () => {
    setCurrentBtn((prevState) =>
      prevState === pages ? prevState : prevState + 1
    );
  };

  return (
    pages !== 0 && (
      <div className="paginate">
        <button
          type="button"
          className={currentBtn === 1 ? "btn-hidden" : ""}
          onClick={prevBtnHandler}
        >
          <svg className="icon-small icon-green">
            <use xlinkHref="/img/icons.svg#icon-arrow-left"></use>
          </svg>
        </button>
        {arrCurrentBtns.map((pageNum, index) => (
          <button
            key={index}
            type="button"
            className={`${currentBtn === pageNum && "btn-active"} ${
              pageNum === "..." && "btn-disabled"
            }`}
            onClick={() => {
              setCurrentBtn(pageNum);
              sessionStorage.setItem(type, pageNum);
            }}
          >
            {pageNum}
          </button>
        ))}
        {pages > 6 && currentBtn < pages - 2 && (
          <button type="button" className="btn-disabled" disabled>
            ...
          </button>
        )}
        <button
          className={currentBtn === pages ? "btn-hidden" : ""}
          type="button"
          onClick={nextBtnHandler}
        >
          <svg className="icon-small icon-green">
            <use xlinkHref="/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </button>
      </div>
    )
  );
}
