import { Link, useRouteError } from "react-router-dom";

import "./Error.css";

export default function Error({ customError }) {
  const error = useRouteError() || customError;

  let errorContent;
  if (error.status === 404) {
    errorContent = "Page not found!";
  } else if (error.status === 403) {
    errorContent = "You don't have access to this page!";
  } else {
    console.error("Error:", error);
    errorContent = "Please try again later!";
  }

  return (
    <div className="error">
      <div className="error__title">
        <h2 className="heading-secondary heading-secondary--error">
          Uh oh! Something went wrong!
        </h2>
        <h2 className="error__emoji"></h2>
      </div>
      <div className="error__msg">{errorContent}</div>

      <Link to={-1 || "/"} className="btn btn--green btn--small">
        Go back
      </Link>
    </div>
  );
}
