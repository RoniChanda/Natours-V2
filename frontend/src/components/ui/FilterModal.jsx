import ModalContainer from "./ModalContainer";
import InnerContainer from "./InnerContainer";
import "./FilterModal.css";

export default function FilterModal({ children, onCancel }) {
  return (
    <ModalContainer onCancel={onCancel}>
      <InnerContainer className="filter-modal" heading="Filter">
        <div className="filter-modal-inner">{children}</div>
        <div className="form__group right">
          <button
            type="button"
            className="btn btn--small btn--green"
            onClick={onCancel}
          >
            Done
          </button>
        </div>
      </InnerContainer>
    </ModalContainer>
  );
}
