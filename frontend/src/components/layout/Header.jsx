import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Search from "../ui/Search";
import { useLogoutMutation } from "../../redux/apis/authApi";
import { useGetMeQuery } from "../../redux/apis/userApi";
import { setAlert } from "../../redux/slices/userSlice";
import "./Header.css";

export default function Header() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: getMeLoading } = useGetMeQuery(null, { skip: user });
  const [logout, { error, data }] = useLogoutMutation();

  useEffect(() => {
    if (error) dispatch(setAlert({ type: "error", msg: error }));

    if (data?.status === "SUCCESS") {
      dispatch(setAlert({ type: "success", msg: "Logout successful." }));
      navigate("/");
    }
  }, [navigate, data, error, dispatch]);

  return (
    <header className="header">
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
