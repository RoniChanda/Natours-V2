import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Search from "../ui/Search";
import Alert from "../ui/Alert";
import { useLogoutMutation } from "../../redux/apis/authApi";
import { useGetMeQuery } from "../../redux/apis/userApi";
import "./Header.css";

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { isLoading: getMeLoading } = useGetMeQuery(null, { skip: user });
  const [logout, { error: logoutError, data: logoutData }] =
    useLogoutMutation();

  useEffect(() => {
    if (logoutData?.status === "SUCCESS") navigate("/");
  }, [navigate, logoutData]);

  const error = logoutError;

  return (
    <header className="header">
      {error && <Alert type="error" msg={error.data?.message || error.error} />}
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
        <Search />
      </nav>
      <Link to="/" className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </Link>
      <nav className="nav nav--user">
        {!getMeLoading && (
          <Fragment>
            {user ? (
              <Fragment>
                <button
                  type="button"
                  className="nav__el"
                  onClick={() => logout()}
                >
                  Log out
                </button>
                <Link to="/me/profile" className="nav__el">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="nav__user-img"
                  />
                  <span>Hi, {user.name.split(" ")[0]}!</span>
                </Link>
              </Fragment>
            ) : (
              <Fragment>
                <Link to="/auth/login" className="nav__el">
                  Log in
                </Link>
                <Link to="/auth/signup" className="nav__el nav__el--cta">
                  Sign up
                </Link>
              </Fragment>
            )}
          </Fragment>
        )}
      </nav>
    </header>
  );
}
