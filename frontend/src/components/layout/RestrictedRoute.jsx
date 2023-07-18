import { useSelector } from "react-redux";
import { useOutlet } from "react-router-dom";

import Error from "./Error";

export default function RestrictedRoute({ restrictTo, children, type }) {
  const { user } = useSelector((state) => state.user);
  const outlet = useOutlet();

  if (user) {
    if (type === "provider" && !restrictTo.includes(user.provider)) {
      return <Error customError={{ status: 403 }} />;
    }

    if (type === "role" && !restrictTo.includes(user.role)) {
      return <Error customError={{ status: 403 }} />;
    }
  }

  return children || outlet;
}
