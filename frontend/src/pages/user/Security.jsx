import { Fragment } from "react";
import { useSelector } from "react-redux";

import EnableTwoFactor from "../../components/user-details/EnableTwoFactor";
import DeleteAccount from "../../components/user-details/DeleteAccount";
import UserContainer from "../../components/ui/UserContainer";
import Meta from "../../components/ui/Meta";

export default function Security() {
  const { user } = useSelector((state) => state.user);

  return (
    user && (
      <UserContainer>
        <Meta
          title={`${user.name} | Security`}
          description="Enable two factor authentication for better security and also deactivate/delete account"
        />
        {user.provider === "local" && (
          <Fragment>
            <EnableTwoFactor />
            <div className="line">&nbsp;</div>
          </Fragment>
        )}

        <DeleteAccount />
      </UserContainer>
    )
  );
}
