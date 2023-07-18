import { Fragment, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import Search from "../ui/Search";
import Alert from "../ui/Alert";
import { useGetMeQuery } from "../../redux/apis/userApi";
import { useLogoutMutation } from "../../redux/apis/authApi";
import "./Header.css";

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const [cookies, setCookie] = useCookies(["logged_in"]);
  const navigate = useNavigate();
  const [logout, { error: logoutError, data: logoutData }] =
    useLogoutMutation();
  const { isLoading: getMeLoading, error: getMeError } = useGetMeQuery(null, {
    skip: !cookies.logged_in,
  });

  useLayoutEffect(() => {
    if (user) {
      setCookie("user", true, { path: "/", maxAge: 1 });
    }
  }, [user, setCookie]);

  useEffect(() => {
    if (logoutData?.status === "SUCCESS") navigate("/");
  }, [navigate, logoutData]);

  const error = getMeError || logoutError;

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