import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import InnerContainer from "../../components/ui/InnerContainer";
import Input from "../../components/form/Input";
import Alert from "../../components/ui/Alert";
import Container from "../../components/ui/Container";
import BtnChooseMethod from "../../components/form/BtnChooseMethod";
import { useForgotPasswordMutation } from "../../redux/apis/authApi";
import Loader from "../../components/ui/Loader";
import Meta from "../../components/ui/Meta";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const linkInEmailHandler = () => {
    forgotPassword({ email, type: "link", medium: "email" })
      .unwrap()
      .then(() => navigate("/verifyCode?type=reset", { state: { email } }));
  };
  const codeInEmailHandler = () => {
    forgotPassword({ email, type: "code", medium: "email" })
      .unwrap()
      .then(() => navigate("/verifyCode?type=reset"));
  };
  const codeInPhoneHandler = () => {
    forgotPassword({ email, type: "code", medium: "phone" })
      .unwrap()
      .then(() => navigate("/verifyCode?type=reset"));
  };

  return (
    <Container>
      <Meta
        title={`Forgot Password | Natours`}
        description="Forgot your password? Please enter your email and choose a method to reset password"
      />
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
      <InnerContainer className="login-form" heading="Account Recovery">
        <p className="title__description">
          Please enter your email and choose a way to recover your account
        </p>
        <Input
          groupClass="ma-bt-md"
          required
          name="email"
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="sub-heading-container">
          <h3 className="sub-heading">Choose a way:</h3>
          {isLoading && <Loader />}
        </div>

        <BtnChooseMethod onClick={linkInEmailHandler}>
          Get Verification <span className="bold">link</span> in email
        </BtnChooseMethod>
        <BtnChooseMethod onClick={codeInEmailHandler}>
          Get Verification <span className="bold">code</span> in email
        </BtnChooseMethod>
        <BtnChooseMethod onClick={codeInPhoneHandler}>
          Get Verification <span className="bold">code</span> in phone
        </BtnChooseMethod>
        <div className="form__link">
          Go back to{" "}
          <Link className="btn-secondary" to="/auth/login">
            Login
          </Link>
        </div>
      </InnerContainer>
    </Container>
  );
}
