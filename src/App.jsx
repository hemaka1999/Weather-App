import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
  
    setTimeout(() => {
      setIsAuthenticated(true); // Set this to true if the user is authenticated.
    }, 2000);
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route
            path="/weather-details"
            element={
              isAuthenticated ? <WeatherDetails /> : <Navigate to="/login" />
            }
          />
          <Route path="/*" element={<Navigate to="/login" />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
