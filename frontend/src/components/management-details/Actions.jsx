import "./Actions.css";

export default function Actions({ onDelete, onEdit, onCancel }) {
  return (
    <div className="actions">
      {onDelete && (
        <button
          className="btn-secondary btn--xs secondary--red"
          onClick={onDelete}
        >
          <svg className="icon-delete icon-small">
            <use xlinkHref="/img/icons.svg#icon-trash-2"></use>
          </svg>
          <p className="action-type">Delete</p>
        </button>
      )}

      {onEdit && (
        <button className="btn-secondary btn--xs" onClick={onEdit}>
          <svg className="icon-edit icon-small">
            <use xlinkHref="/img/icons.svg#icon-edit"></use>
          </svg>
          <p className="action-type">Edit</p>
        </button>
      )}

      {onCancel && (
        <button
          className="btn-secondary btn--xs secondary--red"
          onClick={onCancel}
        >
          <svg className="icon-delete icon-small">
            <use xlinkHref="/img/icons.svg#icon-xmark"></use>
          </svg>
          <p className="action-type">Cancel</p>
        </button>
      )}
    </div>
  );
}
