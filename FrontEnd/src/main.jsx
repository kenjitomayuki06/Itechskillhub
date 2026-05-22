import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Sora', sans-serif",
            fontSize: "13.5px",
            borderRadius: "10px",
            background: "#1a1f35",
            color: "#fff",
            padding: "12px 16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            duration: 5000,
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);