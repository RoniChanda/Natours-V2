import { useSelector } from "react-redux";

import UserProfile from "../../components/shared/UserProfile";
import UserContainer from "../../components/ui/UserContainer";
import Meta from "../../components/ui/Meta";

export default function MyDetails() {
  const { user } = useSelector((state) => state.user);

  return (
    user && (
      <UserContainer>
        <Meta
          title={`${user.name} | Profile`}
          description="View your profile in Natours"
        />
        <div className="user-view__form-container">
          <UserProfile user={user} />
        </div>
      </UserContainer>
    )
  );
}
