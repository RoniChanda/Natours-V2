import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSendVerificationCodeMutation } from "../../redux/apis/userApi";
import "./IsVerified.css";
import Alert from "../ui/Alert";

export default function IsVerified({ checkVerification, medium }) {
  const navigate = useNavigate();
  const [sendVerificationCode, { isLoading, error, data }] =
    useSendVerificationCodeMutation();

  useEffect(() => {
    if (data?.status === "SUCCESS")
      navigate(`/verifyCode?type=verification&medium=${medium}`);
  }, [data, navigate, medium]);

  return (
    <div className={`verification-check ${medium}-check`}>
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
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
