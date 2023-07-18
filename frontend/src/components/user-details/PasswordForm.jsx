import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUpdatePasswordMutation } from "../../redux/apis/userApi";
import Alert from "../ui/Alert";
import Input from "../form/Input";
import { useLogoutMutation } from "../../redux/apis/authApi";
import "../shared/DetailsForm.css";

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  const [updatePassword, { isLoading, data: updateData, error: updateError }] =
    useUpdatePasswordMutation();
  const [logout, { data: logoutData, error: logoutError }] =
    useLogoutMutation();

  useEffect(() => {
    if (updateData?.status === "SUCCESS") logout();
  }, [updateData, logout]);

  useEffect(() => {
    if (logoutData?.status === "SUCCESS") navigate("/");
  }, [navigate, logoutData]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    updatePassword(formData);
  };

  const error = updateError || logoutError;

  let alert;
  if (error) {
    alert = <Alert type="error" msg={error.data?.message || error.error} />;
  } else if (updateData?.status === "SUCCESS") {
    alert = <Alert type="success" msg="Password updated successfully!" />;
  }

  return (
    <form onSubmit={submitHandler}>
      {alert}
      <Input
        required
        name="currentPassword"
        type="password"
        placeholder="current password"
        value={formData.currentPassword}
        onChange={inputHandler}
      />
      <Input
        required
        name="password"
        type="password"
        placeholder="New password"
        value={formData.password}
        onChange={inputHandler}
      />
      <Input
        groupClass="ma-bt-lg"
        required
        name="passwordConfirm"
        type="password"
        placeholder="Confirm password"
        value={formData.passwordConfirm}
        onChange={inputHandler}
      />

      <div className="form__group right">
        <button
          type="submit"
          className={`btn btn--large btn--green ${isLoading && "btn--loading"}`}
        >
          Save password
        </button>
      </div>
    </form>
  );
}
