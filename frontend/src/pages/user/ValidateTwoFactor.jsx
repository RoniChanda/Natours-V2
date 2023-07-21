import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Input from "../../components/form/Input";
import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import { useValidate2FAMutation } from "../../redux/apis/authApi";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function ValidateTwoFactor() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const redirect = searchParams.get("redirect");
  const [validate2FA, { isLoading, error, data }] = useValidate2FAMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(
        setAlert({
          type: "success",
          msg: `Welcome back, ${data?.data?.user.name}!`,
        })
      );
      navigate(redirect);
    }
  }, [data, navigate, redirect, dispatch, error]);

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
