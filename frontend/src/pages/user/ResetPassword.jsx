import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import Input from "../../components/form/Input";
import ButtonAuth from "../../components/form/ButtonAuth";
import {
  useResetPasswordUsingCodeMutation,
  useResetPasswordUsingLinkMutation,
} from "../../redux/apis/authApi";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  const dispatch = useDispatch();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const navigate = useNavigate();
  const [
    resetUsingLink,
    { isLoading: linkLoading, error: linkError, data: linkData },
  ] = useResetPasswordUsingLinkMutation();
  const [
    resetUsingCode,
    { isLoading: codeLoading, error: codeError, data: codeData },
  ] = useResetPasswordUsingCodeMutation();

  const data = linkData || codeData;
  const isLoading = linkLoading || codeLoading;
  const error = linkError || codeError;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(
        setAlert({
          type: "success",
          msg: "Password reset successful. Login with your new password.",
        })
      );
      navigate("/auth/login");
    }
  }, [data, navigate, dispatch, error]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (token) resetUsingLink({ code: token, ...formData });
    if (userId) resetUsingCode({ userId, ...formData });
  };

  return (
    <Container>
      <Meta
        title={`Reset Password | Natours`}
        description="Reset your password"
      />

      <InnerContainer className="login-form" heading="Reset Password">
        <form onSubmit={submitHandler}>
          <Input
            required
            name="password"
            placeholder="Password"
            type="password"
            onChange={inputHandler}
            value={formData.password}
          />
          <Input
            required
            name="passwordConfirm"
            placeholder="Confirm password"
            type="password"
            value={formData.passwordConfirm}
            onChange={inputHandler}
          />
          <ButtonAuth isLoading={isLoading}>Reset</ButtonAuth>
        </form>
      </InnerContainer>
    </Container>
  );
}
