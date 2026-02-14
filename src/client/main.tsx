import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import App from "./App";
import Lobby from "./Lobby";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/new" element={<App />} />
        <Route path="/conversation" element={<Navigate to="/new" replace />} />
        <Route path="/conversation/:conversationId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);