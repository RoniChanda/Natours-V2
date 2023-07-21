import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Input from "../form/Input";
import InputPhone from "../form/InputPhone";
import { PHONE_COUNTRIES } from "../../utils/phoneValidation";
import {
  useUpdateMeMutation,
  useUpdateUserByIdMutation,
} from "../../redux/apis/userApi";
import { setAlert } from "../../redux/slices/userSlice";
import "./DetailsForm.css";

export default function DetailsForm({ name, email, userPhone, photo, userId }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    photo: null,
  });
  const [phone, setPhone] = useState();
  const [valid, setValid] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const dispatch = useDispatch();
  const [
    updateMe,
    { isLoading: updateMeLoading, data: updateMeData, error: updateMeError },
  ] = useUpdateMeMutation();
  const [
    updateById,
    {
      isLoading: updateByIdLoading,
      data: updateByIdData,
      error: updateByIdError,
    },
  ] = useUpdateUserByIdMutation();

  useEffect(() => {
    if (name && email) {
      setFormData((prevState) => ({ ...prevState, name, email, photo }));
    }
    if (userPhone) setPhone(userPhone);
  }, [name, email, photo, userPhone]);

  const error = updateMeError || updateByIdError;
  const isLoading = updateMeLoading || updateByIdLoading;
  const data = updateMeData || updateByIdData;

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS")
      dispatch(setAlert({ type: "success", msg: "Details was updated." }));
  }, [error, dispatch, data]);

  const inputHandler = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const imageHandler = (e) => {
    setFormData((prevState) => ({ ...prevState, photo: e.target.files[0] }));
    setPhotoName(e.target.files[0].name);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((el) => form.append(el, formData[el]));
    form.append("phone", phone?.startsWith("+") ? phone : `+${phone}`);

    if (userId) {
      updateById({ userId, form });
    } else {
      updateMe(form);
    }
  };

  return (
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
        groupClass="ma-bt-md"
        required
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={inputHandler}
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

      <div className="form__group form__photo-upload">
        <img className="form__user-photo" src={photo} alt="User photo" />
        <input
          className="form__upload"
          name="photo"
          id="photo"
          type="file"
          accept="image/*"
          onChange={imageHandler}
        />
        <label className="form__label" htmlFor="photo">
          Choose new photo
        </label>
        <span style={{ marginLeft: "1rem" }}>
          {photoName.length > 25 ? photoName.slice(0, 25) + "..." : photoName}
        </span>
      </div>

      <div className="form__group right">
        <button
          type="submit"
          className={`btn btn--large btn--green ${isLoading && "btn--loading"}`}
        >
          Save settings
        </button>
      </div>
    </form>
  );
}
