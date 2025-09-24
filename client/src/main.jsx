// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import OwnerApp from "./OwnerApp.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Determine which app to load based on port
const currentPort = window.location.port;
const isOwnerPortal = currentPort === "3000";

const AppComponent = isOwnerPortal ? OwnerApp : App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </React.StrictMode>
);
