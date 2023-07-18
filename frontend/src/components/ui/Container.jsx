import { Fragment } from "react";

import Footer from "../layout/Footer";
import "./Container.css";

export default function Container({ children, noMain, style }) {
  return (
    <Fragment>
      <main className={!noMain ? "main" : undefined} style={style}>
        {children}
      </main>
      <Footer />
    </Fragment>
  );
}
