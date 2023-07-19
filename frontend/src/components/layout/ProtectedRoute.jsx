import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetMeQuery } from "../../redux/apis/userApi";
import Error from "./Error";
import Loader from "../ui/Loader";

export default function ProtectedRoute({
  reverse,
  type,
  restrictTo,
  children,
}) {
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const redirect = searchParams.get("redirect");
  const { isLoading } = useGetMeQuery();

  if (isLoading) return <Loader />;

  if (reverse) {
    return user ? (
      <Navigate to={redirect || "/"} state={location} replace />
    ) : (
      children
    );
  }

  if (type && user) {
    if (
      (type === "provider" && restrictTo.includes(user.provider)) ||
      (type === "role" && restrictTo.includes(user.role))
    ) {
      return children;
    } else {
      return <Error customError={{ status: 403 }} />;
    }
  } else if (!type) {
    return user ? (
      children
    ) : (
      <Navigate to="/auth/login" state={location} replace />
    );
  }
}
