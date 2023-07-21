import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Modal from "../ui/Modal";
import { useDeleteUserByIdMutation } from "../../redux/apis/userApi";
import { setAlert } from "../../redux/slices/userSlice";
import "./ManageUserItem.css";

export default function ManageUserItem({ user }) {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteUser, { isLoading, error, isSuccess }] =
    useDeleteUserByIdMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (isSuccess) {
      dispatch(setAlert({ type: "success", msg: "User was deleted." }));
      setModal(false);
    }
  }, [isSuccess, error, dispatch]);

  return (
    <Fragment>
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
            <button
              className="btn-secondary btn--xs"
              onClick={() => navigate(`/manage/users/edit/${user._id}`)}
            >
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
