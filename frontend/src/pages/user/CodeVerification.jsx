import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import Input from "../../components/form/Input";
import Container from "../../components/ui/Container";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function CodeVerification() {
  const [code, setCode] = useState();
  const email = useLocation().state?.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
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
    { isLoading: validate2FALoading, error: validate2FAError },
  ] = useValidate2FAEmailOrPhoneMutation();
  const [
    verifyMedium,
    { isLoading: verifyMediumLoading, error: verifyMediumError },
  ] = useVerifyEmailOrPhoneMutation();

  const error = validate2FAError || verifyResetError || verifyMediumError;
  const isLoading =
    validate2FALoading || verifyResetLoading || verifyMediumLoading;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));
  }, [error, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchParams.get("type") === "reset") {
      verifyResetCode({ code })
        .unwrap()
        .then(() => {
          dispatch(
            setAlert({ type: "success", msg: "Code verification successful." })
          );
          navigate(`/auth/passwordReset?id=${verifyResetData.userId}`);
        });
    } else if (searchParams.get("type") === "twoFactor") {
      validate2FA({ code })
        .unwrap()
        .then(({ data }) => {
          dispatch(
            setAlert({
              type: "success",
              msg: `Welcome back, ${data?.data?.user.name}!`,
            })
          );
          navigate(redirect);
        });
    } else if (searchParams.get("type") === "verification") {
      verifyMedium({ code, medium: searchParams.get("medium") })
        .unwrap()
        .then(() => {
          dispatch(
            setAlert({
              type: "success",
              msg: `Your ${searchParams.get("medium")} was verified.`,
            })
          );
          navigate("/me");
        });
    }
  };

  return (
    <Container>
      <Meta
        title={`Code Verify | Natours`}
        description="Please don't share your code with anyone. Top Secret!"
      />
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
