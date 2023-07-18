import "./OverviewBoxItem.css";

export default function OverviewBoxItem({ icon, photo, label, text }) {
  return (
    <div className="overview-box__detail">
      {icon && (
        <svg className="overview-box__icon">
          <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
        </svg>
      )}
      {photo && <img className="overview-box__img" src={photo} alt={text} />}
      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  );
}
