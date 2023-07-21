import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Alert from "../ui/Alert";

export default function RootLayout() {
  const { alertType, alertMsg } = useSelector((state) => state.user);

  return (
    <Fragment>
      <Alert type={alertType} msg={alertMsg} />
      <Header />
      <Outlet />
    </Fragment>
  );
}
