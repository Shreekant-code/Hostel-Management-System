import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/Auth.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { zIndex: 9999 }, 
        }}
      />
      
      <App />
    </AuthProvider>
  </StrictMode>
);
