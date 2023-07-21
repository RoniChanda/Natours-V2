import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import UserProfile from "../../components/shared/UserProfile";
import Loader from "../../components/ui/Loader";
import UserContainer from "../../components/ui/UserContainer";
import { useGetUserByIdQuery } from "../../redux/apis/userApi";
import Meta from "../../components/ui/Meta";
import { setAlert } from "../../redux/slices/userSlice";

export default function UserDetails() {
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
    content = <UserProfile user={data.data.user} />;
  }

  return (
    <UserContainer backLink>
      <div className="user-view__form-container">
        <Meta
          title={`${data?.data?.user.name} | Profile`}
          description="View profile of all users, admins, lead-guides and guides"
        />

        {content}
      </div>
    </UserContainer>
  );
}
