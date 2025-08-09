import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import QueryProvider from "./providers/QueryProvider.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter basename="/SitePages/lcdocuments.aspx">
        <App />
        <ToastContainer />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>
);
