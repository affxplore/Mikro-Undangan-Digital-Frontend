// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//   </StrictMode>,
// )
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./api/auth/useAuth.jsx"; // <-- Impor
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        "293729670010-pld7uf1bg3p3svas0g4j7dc7gh33t9jf.apps.googleusercontent.com"
      }
    >
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* <-- Pastikan ini membungkus App */}
          <App />
          <ToastContainer
            position="top-center" // Posisi notifikasi
            autoClose={3000} // Menghilang setelah 3 detik
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
