import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Modal from "../ui/Modal";
import { useDeleteUserByIdMutation } from "../../redux/apis/userApi";
import Alert from "../ui/Alert";
import "./ManageUserItem.css";

export default function ManageUserItem({ user }) {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const [deleteUser, { isLoading, error, data }] = useDeleteUserByIdMutation();

  useEffect(() => {
    if (data?.status === "SUCCESS") setModal(false);
  }, [data]);

  const editHandler = () => {
    navigate(`/manage/users/edit/${user._id}`);
  };

  return (
    <Fragment>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}

      {modal && (
        <Modal
          heading="Delete User"
          message={
            <>
              Do you want to delete <span>{user.name}</span> account
              permanently?
            </>
          }
          onProceed={() => deleteUser(user._id)}
          onCancel={() => setModal(false)}
          isLoading={isLoading}
          headerClass="heading-warning"
        />
      )}

      <div className="users-table-grid">
        <Link
          to={`/manage/users/profile/${user._id}`}
          className="table-img-item table-link-item"
        >
          <img className="manage-user-img" src={user.photo} alt={user.name} />
          <div>
            <h3>{user.name}</h3>
            <p className="useritem-email">{user.email}</p>
          </div>
        </Link>
        <p className="table-p-item">{user.provider}</p>
        <p className="table-p-item">{user.role}</p>
        <p
          className={`useritem-status status-${
            user.active ? "active" : "inactive"
          }`}
        >
          {user.active ? "active" : "inactive"}
        </p>

        <div className="actions">
          <button
            className="btn-secondary btn--xs secondary--red"
            onClick={() => setModal(true)}
          >
            <svg className="icon-delete icon-small">
              <use xlinkHref="/img/icons.svg#icon-trash-2"></use>
            </svg>
            <p className="action-type">Delete</p>
          </button>

          {user.provider === "local" && (
            <button className="btn-secondary btn--xs" onClick={editHandler}>
              <svg className="icon-edit icon-small">
                <use xlinkHref="/img/icons.svg#icon-edit"></use>
              </svg>
              <p className="action-type">Edit</p>
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}
