import { useSelector } from "react-redux";

import DetailsForm from "../../components/shared/DetailsForm";
import UserContainer from "../../components/ui/UserContainer";
import InnerContainer from "../../components/ui/InnerContainer";
import PasswordForm from "../../components/user-details/PasswordForm";
import Meta from "../../components/ui/Meta";

export default function UpdateMyDetails() {
  const { user } = useSelector((state) => state.user);

  return (
    user?.provider === "local" && (
      <UserContainer backLink>
        <Meta
          title={`${user.name} | Edit`}
          description="Edit your profile and change password"
        />
        <InnerContainer
          className="user-view__details-container"
          heading="Update Basic Details"
        >
          <DetailsForm
            name={user.name}
            email={user.email}
            photo={user.photo}
            userPhone={user.phone}
            provider={user.provider}
          />
        </InnerContainer>
        <div className="line">&nbsp;</div>
        <InnerContainer
          className="user-view__details-container"
          heading="Change password"
        >
          <PasswordForm />
        </InnerContainer>
      </UserContainer>
    )
  );
}
