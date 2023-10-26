import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"; // Import Navigate
import Login from "./components/Login";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    // You can implement logic here to check if the user is authenticated.
    // If the user is authenticated, set isAuthenticated to true.
    // For example, you can use Firebase Auth state listeners.
    // Here's a simplified example using a timeout.
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
          {/* Add more routes for other pages as needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
