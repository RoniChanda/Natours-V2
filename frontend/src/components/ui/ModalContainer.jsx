import { Fragment } from "react";
import ReactDOM from "react-dom";

import Backdrop from "./Backdrop";

export default function ModalContainer({ children, onCancel }) {
  const content = (
    <Fragment>
      <Backdrop onClick={onCancel} />
      {children}
    </Fragment>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
}
