import { useSelector } from "react-redux";
import { Navigate, useOutlet, useSearchParams } from "react-router-dom";
import { useGetMeQuery } from "../../redux/apis/userApi";

export default function ProtectedRoute({ reverse, children }) {
  const outlet = useOutlet();
  const { isLoading } = useGetMeQuery();
  const { user } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  let content;
  if (reverse) {
    content = user ? <Navigate to={redirect || "/"} /> : children || outlet;
  } else {
    content = user ? children || outlet : <Navigate to="/auth/login" />;
  }

  return !isLoading && content;
}
