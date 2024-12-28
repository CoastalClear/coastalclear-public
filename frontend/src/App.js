import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Map from "./pages/Map";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Manage from "./pages/Manage";
import Login from "./pages/Login";
import SideNav from "./components/SideNav";
import Validate from "./pages/Validate";
import { UserProvider } from "./UserContext";
import { LocationsProvider } from "./LocationsContext";
import { FeedbackLocationProvider } from "./FeedbackLocationContext";
import PrivateRoute from "./pages/PrivateRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_ID}>
      <UserProvider>
        <LocationsProvider>
          <FeedbackLocationProvider>
            <BrowserRouter>
              <div>
                <SideNav />
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="map" element={<Map />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="manage" element={<Manage />} />
                    <Route path="validate" element={<Validate />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </FeedbackLocationProvider>
        </LocationsProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
