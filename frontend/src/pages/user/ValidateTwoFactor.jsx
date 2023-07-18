import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Input from "../../components/form/Input";
import Alert from "../../components/ui/Alert";
import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import { useValidate2FAMutation } from "../../redux/apis/authApi";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";

export default function ValidateTwoFactor() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [validate2FA, { isLoading, error, data }] = useValidate2FAMutation();
  const userId = searchParams.get("id");
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (data?.status === "SUCCESS") navigate(redirect);
  }, [data, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    validate2FA({ userId, token });
  };

  return (
    <Container>
      <Meta
        title={`Validate Two Factor | Natours`}
        description="Validate code from your authentication app or choose another way"
      />
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
      <InnerContainer className="login-form" heading="Log into your account">
        <form onSubmit={submitHandler}>
          <h3 className="sub-heading ma-bt-lg">Two-Factor Authentication</h3>
          <p className="title__description">
            Open Authentication app in your smartphone and enter the code for
            Natours
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
          <ButtonAuth isLoading={isLoading}>Submit</ButtonAuth>
          <div className="form__link">
            <Link
              className="btn-secondary"
              to={`/auth/twoFactor/chooseMethod?redirect=${redirect}&id=${userId}`}
            >
              Choose another way
            </Link>
          </div>
        </form>
      </InnerContainer>
    </Container>
  );
}
