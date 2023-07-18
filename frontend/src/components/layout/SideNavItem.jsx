import { NavLink } from "react-router-dom";

import "./SideNavItem.css";

export default function SideNavItem({ link, text, icon, className }) {
  return (
    <li>
      <NavLink to={link} className={className || undefined}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
        </svg>
        {text}
      </NavLink>
    </li>
  );
}
