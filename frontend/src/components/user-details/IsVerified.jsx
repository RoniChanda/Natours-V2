import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useSendVerificationCodeMutation } from "../../redux/apis/userApi";
import { setAlert } from "../../redux/slices/userSlice";
import "./IsVerified.css";

export default function IsVerified({ checkVerification, medium }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sendVerificationCode, { isLoading, error, data }] =
    useSendVerificationCodeMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(
        setAlert({
          type: "success",
          msg: `Verfication code was sent to your ${medium}`,
        })
      );
      navigate(`/verifyCode?type=verification&medium=${medium}`);
    }
  }, [data, navigate, medium, dispatch, error]);

  return (
    <div className={`verification-check ${medium}-check`}>
      {checkVerification ? (
        <svg className="icon-green icon-small">
          <use xlinkHref={`/img/icons.svg#icon-check-circle`}></use>
        </svg>
      ) : (
        <button
          className="btn-secondary"
          onClick={() => sendVerificationCode({ medium })}
        >
          {isLoading ? "Loading...." : `Verify ${medium}`}
        </button>
      )}
    </div>
  );
}
