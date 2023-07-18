import { useEffect, useState } from "react";

import "./InputRating.css";

export default function InputRating({ rating, setRating, reviewObj }) {
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (reviewObj) {
      setHover(reviewObj.rating);
    }
  }, [reviewObj]);

  return (
    <div className="input-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? `on--${hover}` : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <svg
              key={star}
              className={`icon-small icon-rating ${
                index <= (hover || rating)
                  ? `icon-color-${hover}`
                  : "icon-inactive"
              }`}
            >
              <use xlinkHref="/img/icons.svg#icon-star"></use>
            </svg>
          </button>
        );
      })}
    </div>
  );
}
