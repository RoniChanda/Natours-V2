import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";

export default function RootLayout() {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
}
