import "./Input.css";

export default function Input({
  groupClass,
  name,
  type,
  required,
  value,
  onChange,
  onClick,
  onBlur,
  placeholder,
  minLength,
  maxLength,
  autoFocus,
  min,
  max,
}) {
  return (
    <div className={`form__group ${groupClass || undefined}`}>
      <input
        className="form__input"
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        onClick={onClick}
        onBlur={onBlur}
        value={value}
        minLength={minLength || (type === "password" ? 8 : "")}
        maxLength={maxLength}
        min={min}
        max={max}
        autoFocus={autoFocus}
      />
    </div>
  );
}
