import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./Alert.css";

export default function Alert({ type, msg }) {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const content = (
    <div className={`alert alert--${type}`}>
      {msg || (type === "error" && "Something went very wrong!")}
    </div>
  );

  return (
    showAlert &&
    ReactDOM.createPortal(content, document.getElementById("alert-modal-hook"))
  );
}
