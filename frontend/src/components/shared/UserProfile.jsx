import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import IsVerified from "../user-details/IsVerified";
import "./UserProfile.css";

export default function UserProfile({ user }) {
  const { user: loggedUser } = useSelector((state) => state.user);

  const isLoggeduser = loggedUser._id.toString() === user._id;

  return (
    <Fragment>
      <div className="user-header">
        <img className="form__user-photo" src={user.photo} alt="User photo" />
        <div>
          <h2 className="heading-secondary">Profile</h2>{" "}
          <p className="user-role">{user.role}</p>
        </div>
      </div>
      <div className="details_container">
        <div className="details_header">
          <p>Name</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Provider</p>
          <p>Status</p>
        </div>
        <div className="details_content">
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.phone || "None"}</p>
          <p className="details_provider">{user.provider}</p>
          <p>{user.active ? "Active" : "Inactive"}</p>
        </div>
        {isLoggeduser && (
          <div className="details_verify">
            <IsVerified checkVerification={user.emailVerified} medium="email" />
            {user.phone && (
              <IsVerified
                checkVerification={user.phoneVerified}
                medium="phone"
              />
            )}
          </div>
        )}
      </div>
      {isLoggeduser && (
        <Fragment>
          {user.provider === "local" ? (
            <Link
              className="btn btn--medium btn--green ma-t-lg"
              to="/me/profile/update"
            >
              Edit Profile
            </Link>
          ) : (
            <p className="title__description ma-t-lg">
              * Profile editing not applicable for 3rd party providers
            </p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
