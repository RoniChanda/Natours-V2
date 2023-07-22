import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import InnerContainer from "../ui/InnerContainer";
import Modal from "../ui/Modal";
import {
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
} from "../../redux/apis/userApi";
import { isLoggedOut, setAlert } from "../../redux/slices/userSlice";
import "./DeleteAccount.css";

export default function DeleteAccount() {
  const [activity, setActivity] = useState("deactivate");
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [
    deactivateAccount,
    {
      isLoading: deactivateLoading,
      isSuccess: deactivateSuccess,
      error: deactivateError,
    },
  ] = useDeactivateAccountMutation();
  const [
    deleteAccount,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError },
  ] = useDeleteAccountMutation();

  const isLoading = deactivateLoading || deleteLoading;
  const error = deactivateError || deleteError;
  const isSuccess = deactivateSuccess || deleteSuccess;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (isSuccess) {
      dispatch(isLoggedOut());
      dispatch(
        setAlert({ type: "success", msg: `Your account was ${activity}d.` })
      );
      navigate("/");
    }
  }, [isSuccess, navigate, dispatch, error, activity]);

  const proceedHandler = () => {
    if (activity === "deactivate") deactivateAccount();
    if (activity === "delete") deleteAccount();
  };

  return (
    <InnerContainer
      className="user-view__form-container"
      heading="Deactivate or delete account"
    >
      {modal && activity && (
        <Modal
          headerClass="heading-warning"
          heading={`${activity} account`}
          message={
            <>
              Do you want to <span>{activity}</span> your account?
            </>
          }
          onCancel={() => setModal(false)}
          onProceed={proceedHandler}
          isLoading={isLoading}
        />
      )}

      <div onChange={(e) => setActivity(e.target.value)}>
        <div className="input-radio-container">
          <input
            id="deactivate"
            type="radio"
            name="activity"
            value="deactivate"
            defaultChecked
          />
          <label htmlFor="deactivate">
            <p>
              <strong>Deactivate Account:</strong> Deactivating your account is{" "}
              <strong>temporary</strong>. Your account will be disabled and will
              not be visible to other users. Your data will not be deleted. You
              can reactiavte your acount simply by login.
            </p>
          </label>
        </div>
        <div className="input-radio-container">
          <input id="delete" type="radio" name="activity" value="delete" />
          <label htmlFor="delete">
            <p>
              <strong>Delete Account:</strong> Deleting your account is{" "}
              <strong>permanent</strong>. All your data (bookings, reviews and
              feedbacks) will be removed and you will not be able to retrieve
              your account anymore.
            </p>
          </label>
        </div>
      </div>
      <div className="form__group right">
        <button
          type="submit"
          className="btn btn--large btn--red"
          onClick={() => setModal(true)}
        >
          {activity}
        </button>
      </div>
    </InnerContainer>
  );
}
