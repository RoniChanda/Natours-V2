import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import InnerContainer from "../ui/InnerContainer";
import Input from "../form/Input";
import { useVerify2FAMutation } from "../../redux/apis/authApi";
import ModalContainer from "../ui/ModalContainer";
import { setAlert } from "../../redux/slices/userSlice";
import "./SetupTwoFactorModal.css";

export default function SetupTwoFactorModal({
  qrCode,
  secret,
  onCancel,
  setModal,
}) {
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [verify2FA, { isLoading, error, data }] = useVerify2FAMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(
        setAlert({
          type: "success",
          msg: "Two-Factor authentication was enabled.",
        })
      );
      setModal(false);
    }
  }, [data, setModal, dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    verify2FA(token);
  };

  return (
    <ModalContainer onCancel={onCancel}>
      <div className="form-modal two-factor-modal-container">
        <InnerContainer className="two-factor-modal" heading="Setup 2FA">
          <form onSubmit={submitHandler}>
            <p className="title__description ma-bt-md">
              Step 1: Install Google Authenticator or Authy in your smartphone
            </p>
            <p className="title__description">Step 2: Scan the QR Code below</p>
            <div className="ma-bt-md center">
              <img src={qrCode} alt="QR Code" />
            </div>

            <p className="title__description ma-bt-lg">
              If your app does not recognize the QR Code then enter the secret
              key <span className="two-factor-secret">{secret}</span> manually
            </p>
            <p className="title__description">
              Step 3: Verify code below to enable two factor
            </p>
            <Input
              required
              name="token"
              type="text"
              placeholder="Enter your code here"
              onChange={(e) => setToken(e.target.value)}
              value={token}
              minLength={6}
              maxLength={6}
            />
            <div className="form__group right">
              <button
                type="button"
                className="btn btn--small btn--red ma-r-sm"
                onClick={onCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`btn btn--small btn--green ${
                  isLoading && "btn--loading"
                }`}
              >
                Verify
              </button>
            </div>
          </form>
        </InnerContainer>
      </div>
    </ModalContainer>
  );
}
