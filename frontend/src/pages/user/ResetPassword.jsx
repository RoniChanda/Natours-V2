import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import Input from "../../components/form/Input";
import ButtonAuth from "../../components/form/ButtonAuth";
import {
  useResetPasswordUsingCodeMutation,
  useResetPasswordUsingLinkMutation,
} from "../../redux/apis/authApi";
import Alert from "../../components/ui/Alert";
import Meta from "../../components/ui/Meta";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
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
    if (data?.status === "SUCCESS") {
      navigate("/auth/login?status=success&msg=Password reset successful.");
    }
  }, [data, navigate]);

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
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
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
