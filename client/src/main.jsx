import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/UserContext.jsx"; 
import { BookingProvider } from "./context/Booking.jsx";
import ScrollToTop from './components/common/ScrollToTop';
import { RoomProvider } from "./context/RoomContext.jsx";
import { ActivityProvider } from "./context/ActivityContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookingProvider>
        <RoomProvider>
          <ActivityProvider>
            <BrowserRouter>
              <ScrollToTop />
              <App />
              <ToastContainer />
            </BrowserRouter>
          </ActivityProvider>
        </RoomProvider>
      </BookingProvider>
    </AuthProvider>
  </StrictMode>
);
