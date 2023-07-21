import {
  Navigate,
  useLocation,
  useOutlet,
  useSearchParams,
} from "react-router-dom";

import { useGetMeQuery } from "../../redux/apis/userApi";
import Error from "./Error";
import Loader from "../ui/Loader";

export default function ProtectedRoute({
  reverse,
  type,
  restrictTo,
  children,
}) {
  const outlet = useOutlet();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { isLoading, data } = useGetMeQuery();

  if (isLoading) {
    return <Loader />;
  } else if (data) {
    const user = data.data.user;

    if (reverse) {
      return <Navigate to={redirect || "/"} state={location} replace />;
    } else if (
      (type === "provider" && !restrictTo.includes(user.provider)) ||
      (type === "role" && !restrictTo.includes(user.role))
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
