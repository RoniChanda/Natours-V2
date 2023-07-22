import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import Input from "../../components/form/Input";
import { useLoginMutation } from "../../redux/apis/authApi";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [local, setLocal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [login, { isLoading, data, error }] = useLoginMutation();

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(setAlert({ type: "success", msg: `Welcome to Natours!` }));
      navigate(redirect);
    }

    if (data?.userId)
      navigate(
        `/auth/twoFactor/authApp?redirect=${redirect}&id=${data.userId}`
      );
  }, [data, navigate, redirect, error, dispatch]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <Container>
      <Meta
        title="Login | Natours"
        description="Login to Natours with local and third-party providers"
      />
      {/* {error && <Alert type="error" msg={error.data?.message || error.error} />} */}
      <InnerContainer className="login-form" heading="Log into your account">
        <form onSubmit={submitHandler}>
          <Input
            required
            name="email"
            type="email"
            placeholder="email"
            onChange={inputHandler}
            onClick={() => setLocal(true)}
            value={formData.email}
          />
          {local && (
            <Fragment>
              <Input
                required
                name="password"
                type="password"
                placeholder="password"
                onChange={inputHandler}
                value={formData.password}
              />
              <div className="form__forgot">
                <Link className="btn-secondary" to="/auth/forgotPassword">
                  Forgot Password?
                </Link>
              </div>
              <ButtonAuth isLoading={isLoading}>Log in</ButtonAuth>
            </Fragment>
          )}
          <div className="form__divider">
            <div className="line-horizontal">&nbsp;</div>
            <p className="content-between">or continue with</p>
            <div className="line-horizontal">&nbsp;</div>
          </div>
          <div className="center">
            <Link
              className="btn btn--white btn--large btn--google"
              to={`${
                import.meta.env.VITE_BACKEND_URL
              }/auth/google?redirect=${redirect}`}
            >
              Google
            </Link>
          </div>
          <div className="form__link">
            Does not have an account?{" "}
            <Link className="btn-secondary" to="/auth/signup">
              Sign up
            </Link>
          </div>
        </form>
      </InnerContainer>
    </Container>
  );
}
