import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";

let token = localStorage.getItem("start21-token")
axios.defaults.baseURL = "http://localhost:2100/api";
axios.defaults.headers.common["token"] = token;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ToastContainer theme="colored" />
  </BrowserRouter>
);
