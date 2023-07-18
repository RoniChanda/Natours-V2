import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Container from "./Container";
import SideNav from "../layout/SideNav";
import "./UserContainer.css";

export default function UserContainer({ children, backLink }) {
  const { user } = useSelector((state) => state.user);

  return (
    user && (
      <Container>
        <div className="user-view">
          <SideNav role={user.role} provider={user.provider} />
          <div className="user-view__content">
            <div className="user-view__back-link">
              {backLink && (
                <Link to={-1} className="back-link">
                  <svg className="icon-small icon-back">
                    <use xlinkHref="/img/icons.svg#icon-arrow-left"></use>
                  </svg>
                </Link>
              )}
            </div>

            {children}
          </div>
        </div>
      </Container>
    )
  );
}
