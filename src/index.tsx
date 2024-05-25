import React from "react";
import { createRoot } from "react-dom/client";

import "./asset/styles/app.scss";
import { Provider } from "react-redux";
import store from "./lib/redux/Store";
import { MultiSelectComponent } from "@components/multiSelect";

function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <MultiSelectComponent />
      </div>
    </Provider>
  );
}

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
