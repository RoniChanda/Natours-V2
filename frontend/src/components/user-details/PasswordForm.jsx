import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useUpdatePasswordMutation } from "../../redux/apis/userApi";
import Input from "../form/Input";
import { useLogoutMutation } from "../../redux/apis/authApi";
import { setAlert } from "../../redux/slices/userSlice";
import "../shared/DetailsForm.css";

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatePassword, { isLoading, data: updateData, error: updateError }] =
    useUpdatePasswordMutation();
  const [logout, { data: logoutData, error: logoutError }] =
    useLogoutMutation();

  useEffect(() => {
    if (updateData?.status === "SUCCESS") logout();
  }, [updateData, logout]);

  const error = updateError || logoutError;
  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (logoutData?.status === "SUCCESS") {
      dispatch(
        setAlert({
          type: "success",
          msg: "Your password was updated. Please login again.",
        })
      );
      navigate("/");
    }
  }, [navigate, logoutData, error, dispatch]);

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

  return (
    <form onSubmit={submitHandler}>
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
