import InputSelect from "../ui/InputSelect";
import "./RatingsDetail.css";

export default function RatingsDetail({ tour, onChange }) {
  const { reviewsCount, ratingsAverage, ratingsQuantity } = tour;

  const percentageArr = [5, 4, 3, 2, 1].map((num) => {
    const countObj = reviewsCount.find((el) => el.star === num);
    if (countObj) {
      return {
        star: countObj.star,
        percentage: (countObj.total * 100) / ratingsQuantity,
      };
    } else {
      return { star: num, percentage: 0 };
    }
  });

  return (
    <div className="bars-container">
      <div>
        {percentageArr.map((el) => (
          <div key={el.star} className="bar-inner">
            <p>{el.star}</p>
            <div className="bar">
              <div
                className={`bar-color-${el.star}`}
                style={{ width: el.percentage, height: "100%" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="average_details">
        <svg className={`icon-large icon-green`}>
          <use xlinkHref="/img/icons.svg#icon-star"></use>
        </svg>
        <h3>{ratingsAverage} out of 5</h3>
        <p>({ratingsQuantity} Reviews) </p>
      </div>
      <div className="rating-filter">
        <InputSelect type="rating" onChange={onChange}>
          <option value="">All</option>
          <option value="5">5 Star</option>
          <option value="4">4 Star</option>
          <option value="3">3 Star</option>
          <option value="2">2 Star</option>
          <option value="1">1 Star</option>
        </InputSelect>
      </div>
    </div>
  );
}
