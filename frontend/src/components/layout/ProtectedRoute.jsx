import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useOutlet,
  useSearchParams,
} from "react-router-dom";

import { useGetMeQuery, userApi } from "../../redux/apis/userApi";
import Error from "./Error";
import Loader from "../ui/Loader";

export default function ProtectedRoute({
  reverse,
  type,
  restrictTo,
  children,
}) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const outlet = useOutlet();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { isLoading, data } = useGetMeQuery();

  useEffect(() => {
    if (data && !user) dispatch(userApi.util.resetApiState());
  }, [data, user, dispatch]);

  if (isLoading) {
    return <Loader />;
  } else if (data) {
    const loggedUser = data.data?.user;

    if (reverse) {
      return <Navigate to={redirect || "/"} state={location} replace />;
    } else if (
      (type === "provider" && !restrictTo.includes(loggedUser.provider)) ||
      (type === "role" && !restrictTo.includes(loggedUser.role))
    ) {
      return <Error customError={{ status: 403 }} />;
    } else {
      return children || outlet;
    }
  } else {
    if (reverse) {
      return outlet;
    } else {
      return <Navigate to="/auth/login" state={location} replace />;
    }
  }
}
