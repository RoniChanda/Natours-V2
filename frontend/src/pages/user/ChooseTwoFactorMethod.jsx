import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import BtnChooseMethod from "../../components/form/BtnChooseMethod";
import { useSend2FACodeMutation } from "../../redux/apis/authApi";
import Loader from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import Meta from "../../components/ui/Meta";

export default function ChooseTwoFactorMethod() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [send2FACode, { isLoading, error, data }] = useSend2FACodeMutation();
  const userId = searchParams.get("id");
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (data?.status === "SUCCESS")
      navigate(`/verifyCode?type=twoFactor&redirect=${redirect}`);
  }, [data, navigate, redirect]);

  const codeInEmailHandler = () => {
    send2FACode({ userId, medium: "email" });
  };
  const codeInPhoneHandler = () => {
    send2FACode({ userId, medium: "phone" });
  };

  return (
    <Container>
      <Meta
        title={`Choose Two-factor Method | Natours`}
        description="Choose two factor authentication method"
      />

      {error && <Alert type="error" msg={error.data?.message || error.error} />}

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
