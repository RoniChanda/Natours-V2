import "./TourHeader.css";

export default function TourHeader({
  imageCover,
  name,
  duration,
  startLocation,
}) {
  return (
    <section className="section-header">
      <div className="header__hero">
        <div className="header__hero-overlay">&nbsp;</div>
        <img src={imageCover} alt={name} className="header__hero-img" />
      </div>
      <div className="heading-box">
        <h1 className="heading-primary">
          <span>{name}</span>
        </h1>
        <div className="heading-box__group">
          <div className="heading-box__detail">
            <svg className="heading-box__icon">
              <use xlinkHref="/img/icons.svg#icon-clock"></use>
            </svg>
            <span className="heading-box__text">{duration} days</span>
          </div>
          <div className="heading-box__detail">
            <svg className="heading-box__icon">
              <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
            </svg>
            <span className="heading-box__text">
              {startLocation.description}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
