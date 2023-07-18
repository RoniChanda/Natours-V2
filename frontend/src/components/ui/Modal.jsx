import InnerContainer from "./InnerContainer";
import ModalContainer from "./ModalContainer";
import "./Modal.css";

export default function Modal({
  onProceed,
  onCancel,
  isLoading,
  heading,
  message,
  headerClass,
}) {
  return (
    <ModalContainer onCancel={onCancel}>
      <InnerContainer
        heading={heading}
        headerClass={headerClass}
        className="modal"
      >
        <p className="modal_message">{message}</p>
        <div className="form__group right">
          <button
            type="button"
            className="btn btn--small btn--red ma-r-sm"
            onClick={onCancel}
          >
            No
          </button>

          <button
            type="submit"
            className={`btn btn--small btn--green ${
              isLoading && "btn--loading"
            }`}
            onClick={onProceed}
          >
            Yes
          </button>
        </div>
      </InnerContainer>
    </ModalContainer>
  );
}
