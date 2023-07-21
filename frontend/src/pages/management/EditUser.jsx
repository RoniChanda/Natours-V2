import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Loader from "../../components/ui/Loader";
import UserContainer from "../../components/ui/UserContainer";
import DetailsForm from "../../components/shared/DetailsForm";
import { useGetUserByIdQuery } from "../../redux/apis/userApi";
import InnerContainer from "../../components/ui/InnerContainer";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function EditUser() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoading, data, error } = useGetUserByIdQuery(id);

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));
  }, [error, dispatch]);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (data) {
    const user = data.data.user;

    content = (
      <DetailsForm
        name={user.name}
        email={user.email}
        photo={user.photo}
        userPhone={user.phone}
        userId={id}
        provider={user.provider}
      />
    );
  }

  return (
    <UserContainer backLink>
      <InnerContainer
        className="user-view__form-container"
        heading="Update Basic Details"
      >
        {data && (
          <Meta
            title={`${data.data?.user.name} | Edit`}
            description="Edit user profile by admin"
          />
        )}

        {content}
      </InnerContainer>
    </UserContainer>
  );
}
