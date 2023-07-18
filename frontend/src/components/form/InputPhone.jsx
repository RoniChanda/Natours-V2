import { useState } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function InputPhone({ value, onChange, valid }) {
  const [focus, setFocus] = useState(false);

  return (
    <PhoneInput
      containerClass="form__group"
      inputStyle={{
        width: "100%",
        height: "4.9rem",
        fontSize: "1.5rem",
        fontFamily: "Lato, sans-serif",
        color: "inherit",
        backgroundColor: "#f2f2f2",
        border: "none",
        borderTop: "3px solid transparent",
        borderBottom: "3px solid",
        borderBottomColor: focus
          ? valid
            ? "#55c57a"
            : "#ff7730"
          : "transparent",
        borderRadius: "4px",
        transition: "all 0.3s",
      }}
      buttonStyle={{
        backgroundColor: "#d2d2d2",
        border: "none",
        borderBottom: "3px solid",
        borderBottomColor: focus
          ? valid
            ? "#55c57a"
            : "#ff7730"
          : "transparent",
        borderRadius: "4px",
        transition: "all 0.3s",
      }}
      country={"in"}
      inputProps={{
        required: true,
      }}
      placeholder="PHONE NUMBER"
      value={value}
      onChange={onChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      isValid={valid}
    />
  );
}
