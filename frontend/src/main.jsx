import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";

import App from "./App.jsx";
import { store } from "./redux/store.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);
