import "./InputSelect.css";

export default function InputSelect({
  children,
  onChange,
  type,
  value,
  placeholder,
}) {
  return (
    <div className="input-select-container">
      <label htmlFor="input-select-label">{type}:</label>
      <div className="input-select">
        <svg className="icon-green icon-small icon-down">
          <use xlinkHref="/img/icons.svg#icon-chevron-down"></use>
        </svg>
        <select
          id={type}
          name={type}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
