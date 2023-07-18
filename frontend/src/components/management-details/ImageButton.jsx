import "./ImageButton.css";

export default function ImageButton({ src, onClick }) {
  return (
    <div className="image-button-container ma-r-sm">
      <img src={src} alt="Tour cover image" />
      <button type="button" onClick={onClick}>
        <svg className="icon-delete icon-small icon-white">
          <use xlinkHref="/img/icons.svg#icon-x"></use>
        </svg>
      </button>
    </div>
  );
}
