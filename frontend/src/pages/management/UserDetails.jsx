import { useParams } from "react-router-dom";
import UserProfile from "../../components/shared/UserProfile";
import Alert from "../../components/ui/Alert";
import Loader from "../../components/ui/Loader";
import UserContainer from "../../components/ui/UserContainer";
import { useGetUserByIdQuery } from "../../redux/apis/userApi";
import Meta from "../../components/ui/Meta";

export default function UserDetails() {
  const { id } = useParams();
  const { isLoading, data, error } = useGetUserByIdQuery(id);

  let content;
  if (isLoading) {
    content = <Loader />;
  } else if (error) {
    content = <Alert type="error" msg={error.data?.message || error.error} />;
  } else {
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
