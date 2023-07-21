import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";

import { clearAlert } from "../../redux/slices/userSlice";
import "./Alert.css";

export default function Alert({ type, msg }) {
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (type && msg) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [msg, type, dispatch]);

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
