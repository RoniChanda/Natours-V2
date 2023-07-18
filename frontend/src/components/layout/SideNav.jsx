import SideNavItem from "./SideNavItem";
import "./SideNav.css";
import { Fragment } from "react";

export default function SideNav({ role }) {
  return (
    <nav className="user-view__menu">
      <ul className="side-nav">
        <SideNavItem
          className={({ isActive }) => (isActive ? "side-nav--active" : "")}
          link="/me/profile"
          text="Profile"
          icon="user"
        />
        <SideNavItem
          className={({ isActive }) => (isActive ? "side-nav--active" : "")}
          link="/me/security"
          text="Security"
          icon="lock"
        />
        <SideNavItem
          className={({ isActive }) => (isActive ? "side-nav--active" : "")}
          link="/me/bookings"
          text="My bookings"
          icon="briefcase"
        />
        {role === "user" && (
          <SideNavItem
            className={({ isActive }) => (isActive ? "side-nav--active" : "")}
            link="/me/Reviews"
            text="My reviews"
            icon="star"
          />
        )}
      </ul>
      {role !== "user" && (
        <div className="admin-nav">
          <h5 className="admin-nav__heading">{role}</h5>
          <ul className="side-nav">
            {role !== "guide" && (
              <SideNavItem
                className={({ isActive }) =>
                  isActive ? "side-nav--active" : ""
                }
                link="/manage/tours"
                text="Manage tours"
                icon="map"
              />
            )}
            {role === "admin" && (
              <Fragment>
                <SideNavItem
                  className={({ isActive }) =>
                    isActive ? "side-nav--active" : ""
                  }
                  link="/manage/users"
                  text="Manage users"
                  icon="users"
                />
                <SideNavItem
                  className={({ isActive }) =>
                    isActive ? "side-nav--active" : ""
                  }
                  link="/manage/reviews"
                  text="Manage reviews"
                  icon="star"
                />
              </Fragment>
            )}
            {role !== "guide" && (
              <SideNavItem
                className={({ isActive }) =>
                  isActive ? "side-nav--active" : ""
                }
                link="/manage/bookings"
                text="Manage bookings"
                icon="briefcase"
              />
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
