import { useCookies } from "react-cookie";
import { Navigate, useOutlet, useSearchParams } from "react-router-dom";

export default function ProtectedRoute({ reverse, children }) {
  const outlet = useOutlet();
  const [cookies] = useCookies(["logged_in"]);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  let content;
  if (reverse) {
    content = cookies.logged_in ? (
      <Navigate to={redirect || "/"} />
    ) : (
      children || outlet
    );
  } else {
    content = cookies.logged_in ? (
      children || outlet
    ) : (
      <Navigate to="/auth/login" />
    );
  }

  return content;
}
