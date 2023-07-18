import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useValidate2FAEmailOrPhoneMutation,
  useVerifyResetCodeMutation,
} from "../../redux/apis/authApi";
import { useVerifyEmailOrPhoneMutation } from "../../redux/apis/userApi";
import InnerContainer from "../../components/ui/InnerContainer";
import Alert from "../../components/ui/Alert";
import Input from "../../components/form/Input";
import Container from "../../components/ui/Container";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";

export default function CodeVerification() {
  const [code, setCode] = useState();
  const email = useLocation().state?.email;
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const navigate = useNavigate();
  const [
    verifyResetCode,
    {
      isLoading: verifyResetLoading,
      error: verifyResetError,
      data: verifyResetData,
    },
  ] = useVerifyResetCodeMutation();
  const [
    validate2FA,
    {
      isLoading: validate2FALoading,
      error: validate2FAError,
      data: validate2FAData,
    },
  ] = useValidate2FAEmailOrPhoneMutation();
  const [
    verifyMedium,
    {
      isLoading: verifyMediumLoading,
      error: verifyMediumError,
      data: verifyMediumData,
    },
  ] = useVerifyEmailOrPhoneMutation();

  useEffect(() => {
    if (verifyResetData?.userId)
      navigate(`/auth/passwordReset?id=${verifyResetData.userId}`);
  }, [verifyResetData, navigate]);

  useEffect(() => {
    if (validate2FAData?.status === "SUCCESS") navigate(redirect);
  }, [validate2FAData, navigate, redirect]);

  useEffect(() => {
    if (verifyMediumData?.status === "SUCCESS") navigate("/me");
  }, [verifyMediumData, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchParams.get("type") === "reset") {
      verifyResetCode({ code });
    } else if (searchParams.get("type") === "twoFactor") {
      validate2FA({ code });
    } else if (searchParams.get("type") === "verification") {
      verifyMedium({ code, medium: searchParams.get("medium") });
    }
  };

  const error = validate2FAError || verifyResetError || verifyMediumError;
  const isLoading =
    validate2FALoading || verifyResetLoading || verifyMediumLoading;

  return (
    <Container>
      <Meta
        title={`Code Verify | Natours`}
        description="Please don't share your code with anyone. Top Secret!"
      />
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
      {email ? (
        <InnerContainer
          className="login-form center"
          heading="Link sent successfully to your email"
        >
          <svg className="icon-large icon-green">
            <use xlinkHref={`/img/icons.svg#icon-check-circle`}></use>
          </svg>
          <div className="form__link">
            Go back to
            <Link className="btn-secondary" to="/auth/login">
              Login
            </Link>
          </div>
        </InnerContainer>
      ) : (
        <InnerContainer className="login-form" heading="Verify Code">
          <form onSubmit={submitHandler}>
            <p className="title__description">
              Please enter the code you recieved in phone/email below
            </p>
            <Input
              required
              name="code"
              type="text"
              placeholder="Enter your code here"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              minLength={6}
              maxLength={6}
            />
            <ButtonAuth isLoading={isLoading}>Submit</ButtonAuth>
          </form>
        </InnerContainer>
      )}
    </Container>
  );
}
