import React from "react";
import { createRoot } from "react-dom/client";
import Home from "@pages/Home";

import "./asset/styles/app.scss";
import { Provider } from "react-redux";
import store from "./lib/redux/Store";

function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
