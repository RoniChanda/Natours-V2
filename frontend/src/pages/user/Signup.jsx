import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Container from "../../components/ui/Container";
import InnerContainer from "../../components/ui/InnerContainer";
import Input from "../../components/form/Input";
import { useSignupMutation } from "../../redux/apis/authApi";
import InputPhone from "../../components/form/InputPhone";
import { PHONE_COUNTRIES } from "../../utils/phoneValidation";
import ButtonAuth from "../../components/form/ButtonAuth";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [phone, setPhone] = useState();
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading, data, error }] = useSignupMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(setAlert({ type: "success", msg: `Welcome to Natours!` }));
      navigate("/");
    }
  }, [data, dispatch, navigate, error]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    signup({ ...formData, phone: `+${phone}` });
  };

  return (
    <Container>
      <Meta
        title="Signup | Natours"
        description="Signup to Natours with email and password"
      />
      <InnerContainer className="login-form" heading="Create new account">
        <form onSubmit={submitHandler}>
          <Input
            required
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={inputHandler}
          />
          <Input
            required
            name="email"
            type="email"
            placeholder="Email"
            onChange={inputHandler}
            value={formData.email}
          />
          <InputPhone
            value={phone}
            valid={valid}
            onChange={(value, country) => {
              setPhone(value);
              PHONE_COUNTRIES.forEach((el) => {
                if (el.iso2 === country.countryCode.toUpperCase()) {
                  if (value.match(el.validation)) {
                    setValid(true);
                  } else {
                    setValid(false);
                  }
                }
              });
            }}
          />
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
          <ButtonAuth isLoading={isLoading}>Sign up</ButtonAuth>
          <div className="form__link">
            Already have an account?{" "}
            <Link className="btn-secondary" to="/auth/login">
              Login
            </Link>
          </div>
        </form>
      </InnerContainer>
    </Container>
  );
}
