import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import BtnChooseMethod from "../../components/form/BtnChooseMethod";
import { useSend2FACodeMutation } from "../../redux/apis/authApi";
import Loader from "../../components/ui/Loader";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function ChooseTwoFactorMethod() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const redirect = searchParams.get("redirect");
  const [send2FACode, { isLoading, error, data }] = useSend2FACodeMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      navigate(`/verifyCode?type=twoFactor&redirect=${redirect}`);
    }
  }, [data, navigate, redirect, dispatch, error]);

  const codeInEmailHandler = () => {
    send2FACode({ userId, medium: "email" })
      .unwrap()
      .then(() =>
        dispatch(
          setAlert({ type: "success", msg: "Code was sent to your email." })
        )
      );
  };

  const codeInPhoneHandler = () => {
    send2FACode({ userId, medium: "phone" })
      .unwrap()
      .then(() =>
        dispatch(
          setAlert({ type: "success", msg: "Code was sent to your phone." })
        )
      );
  };

  return (
    <Container>
      <Meta
        title={`Choose Two-factor Method | Natours`}
        description="Choose two factor authentication method"
      />
      <InnerContainer className="login-form" heading="Log into your account">
        <div className="sub-heading-container">
          <h3 className="sub-heading">Choose a way:</h3>
          {isLoading && <Loader />}
        </div>

        <BtnChooseMethod onClick={codeInPhoneHandler}>
          Get Verification <span className="bold">code</span> in phone
        </BtnChooseMethod>
        <BtnChooseMethod onClick={codeInEmailHandler}>
          Get Verification <span className="bold">code</span> in email
        </BtnChooseMethod>
        <div className="form__link">
          <Link className="btn-secondary" to="/auth/twoFactor/AuthApp">
            Go back
          </Link>
        </div>
      </InnerContainer>
    </Container>
  );
}
