import React, { useState, useEffect } from "react";
import { auth } from "./firebase"; 
import { useNavigate } from "react-router-dom"; 

const API_KEY = "2e0e014306bbb8e6229c5dfa3115f32d"; // Replace with your API key
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5";

function WeatherApp({ isAuthenticated }) {
  const [colomboWeather, setColomboWeather] = useState({});
  const [dailyForecast, setDailyForecast] = useState([]);
  const [dailyForecastSearched, setDailyForecastSearched] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [searched, setSearched] = useState(false); // Track whether the search button was clicked
  const [backgroundImage, setBackgroundImage] = useState(null); // Background image state
  const [backgroundImageSearched, setBackgroundImageSearched] = useState(null); // Background image state for the searched location
  const [weatherIcon, setWeatherIcon] = useState(null); // Weather icon state
  const [forecast, setForecast] = useState([]);
  const [showMoreForecasts, setShowMoreForecasts] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload(); // Reload the page
  };

  // Function to fetch the weather for Colombo
  const fetchColomboWeather = () => {
    fetch(`${API_ENDPOINT}/weather?q=Colombo&appid=${API_KEY}&units=metric`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request error: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setColomboWeather(data);
        // Set the weather icon
        if (data.weather && data.weather.length > 0) {
          setWeatherIcon(data.weather[0].icon);
        }
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  // Function to fetch the daily forecast for Colombo
  const fetchColomboDailyForecast = () => {

    fetch(
      `${API_ENDPOINT}/forecast?lat=6.9271&lon=79.8612&appid=${API_KEY}&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Extract the daily forecast data for the next 5 days (excluding today's data) without duplicates
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const next5DaysData = data.list.filter((item) => {
          const itemDate = new Date(item.dt * 1000);
          const itemDay = itemDate.getDate();
          return itemDay !== currentDay;
        });

        const uniqueDates = [];
        const filteredForecast = [];

        next5DaysData.forEach((item) => {
          const itemDate = new Date(item.dt * 1000);
          const itemDay = itemDate.getDate();
          if (!uniqueDates.includes(itemDay)) {
            uniqueDates.push(itemDay);
            filteredForecast.push(item);
          }
        });

        setDailyForecast(filteredForecast.slice(0, 5)); // Limit to the next 5 days
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  // Function to fetch daily forecast for a searched location
  const fetchSearchedDailyForecast = () => {
    fetch(
      `${API_ENDPOINT}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request error: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        // Extract the daily forecast data from the response for the next 5 days (excluding today's data) without duplicates
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const next5DaysData = data.list.filter((item) => {
          const itemDate = new Date(item.dt * 1000);
          const itemDay = itemDate.getDate();
          return itemDay !== currentDay;
        });

        const uniqueDates = [];
        const filteredForecast = [];

        next5DaysData.forEach((item) => {
          const itemDate = new Date(item.dt * 1000);
          const itemDay = itemDate.getDate();
          if (!uniqueDates.includes(itemDay)) {
            uniqueDates.push(itemDay);
            filteredForecast.push(item);
          }
        });

        setDailyForecastSearched(filteredForecast.slice(0, 5)); // Limit to the next 5 days
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCoordinates();

    // Scroll to the element with id="changeData"
    const changeDataElement = document.getElementById("changeData");
    if (changeDataElement) {
      changeDataElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchWeatherByCoordinates = () => {
    fetch(
      `${API_ENDPOINT}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request error: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);

        // Set the background image for the searched location
        if (data.weather && data.weather.length > 0) {
          setBackgroundImageSearched(getBackgroundImage(data.weather[0].main));
        }

        fetchSearchedDailyForecast(); // Fetch daily forecast for the searched location
        setSearched(true); // Mark as searched after button click
      })
      .catch((error) => {
        console.error("API request error:", error);
      });
  };

  useEffect(() => {
    // Fetch the weather for Colombo and the daily forecast when the component mounts
    fetchColomboWeather();
    fetchColomboDailyForecast();
  }, []);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };

  // Function to toggle the "See More" button
  const toggleForecasts = () => {
    setShowMoreForecasts(!showMoreForecasts);
  };

  // Function to map weather conditions and time of the day to background image URLs
  const getBackgroundImage = (weatherConditions) => {
    const currentTime = new Date().getHours();
    let timeOfDay;

    if (currentTime >= 5 && currentTime < 12) {
      timeOfDay = "morning";
    } else if (currentTime >= 12 && currentTime < 18) {
      timeOfDay = "day";
    } else {
      timeOfDay = "night";
    }

    if (weatherConditions === "Clouds") {
      return `url('../public/images/${timeOfDay}_cloudy.jpg')`;
    } else if (weatherConditions === "Rain") {
      return `url('../public/images/${timeOfDay}_rainy.jpg')`;
    } else if (weatherConditions === "Clear") {
      return `url('../public/images/${timeOfDay}_sun.jpg')`;
    } else {
      return `url('../public/images/${timeOfDay}_cloudy.jpg')`;
    }
  };

  // Set the background image and weather icon based on the current weather conditions
  useEffect(() => {
    if (colomboWeather.weather && colomboWeather.weather.length > 0) {
      setBackgroundImage(getBackgroundImage(colomboWeather.weather[0].main));
      setWeatherIcon(colomboWeather.weather[0].icon);
    }
  }, [colomboWeather]);

  // Function to change the background color based on the time of day
  const changeBackgroundColorBasedOnTime = () => {
    const currentTime = new Date().getHours();
    const fullBackground = document.getElementById("fullBackground");
    if (fullBackground) {
      if (currentTime >= 5 && currentTime < 18) {
        // Daytime background color
        fullBackground.classList.add("day-background");
        fullBackground.classList.remove("night-background");
      } else {
        // Nighttime background color
        fullBackground.classList.add("night-background");
        fullBackground.classList.remove("day-background");
      }
    }
  };

  // Add an event listener to update the background color
  useEffect(() => {
    changeBackgroundColorBasedOnTime(); // Set the initial background color
    const intervalId = setInterval(
      changeBackgroundColorBasedOnTime,
      60 * 60 * 1000
    ); // Update every hour

    return () => {
      clearInterval(intervalId); // Clean up the interval
    };
  }, []);

  const handleLogout = () => {
    // Add the logic to sign out the user from Firebase or your authentication system.
    auth
      .signOut() // Replace with the actual sign-out function of your authentication system
      .then(() => {
        localStorage.removeItem("isAuthenticated"); // Remove the authentication status from local storage
        navigate("/login"); // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div
      id="fullBackground"
      className="container-fluid py-1  vw-100 weather-data  "
    >
      <style>
        {`
          .day-background {
            background-color: #ccccff; /* Replace with your desired day color #FFDAB9 */
          }

          .night-background {
            background-color: #666666; /* Replace with your desired night color */
          }
        `}
      </style>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid bg-dark text-center py-2">
          <div className="navbar-header ">
            <h1 className="fw-bold h3 text-light my-1">
              Mickey Arthur's Weather App
            </h1>
          </div>
          <ul className="nav navbar-nav"></ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-4 ">
          <div
            className="card bg-light bg-gradient my-1"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              borderRadius: "1rem",
            }}
          >
            <div className="card-body">
              <h2 className="card-title">Search by Latitude and Longitude</h2>
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="latitude" className="form-label">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="latitude"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="longitude" className="form-label">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="longitude"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <button onClick={handleRefresh} className="btn btn-primary">
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-search"></i> Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xxl-9 col-md-8 mt-md-1 mt-4 pe-lg-4 mx-auto">
          <div
            id="colomboWeather"
            className="current-weather bg-success text-center text-white py-1 px-4 rounded-3"
            style={{
              backgroundImage: backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >
            <div className="mt-1 d-flex justify-content-center">
              <div style={{ position: "relative" }} className="w-100">
                <h3 className="fw-bold">Colombo ({getCurrentDate()})</h3>

                {weatherIcon && (
                  <img
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "100px",
                      height: "100px",
                    }}
                    src={`http://openweathermap.org/img/wn/${weatherIcon}.png`}
                    alt="Weather Icon"
                  />
                )}
                <h4 className="my-2 mt-3">
                  {colomboWeather.weather && colomboWeather.weather.length > 0
                    ? colomboWeather.weather[0].description.toUpperCase()
                    : "N/A"}
                </h4>
                <h6 className="my-2 mt-3">
                  Temperature: {colomboWeather.main?.temp}°C
                </h6>
                <h6 className="my-2">
                  Wind: {(colomboWeather.wind?.speed * 3.6).toFixed(2)} km/h
                </h6>
                <h6 className="my-2">
                  Humidity: {colomboWeather.main?.humidity}%
                </h6>
              </div>
            </div>
          </div>
          <div className="col-xxl-9 col-md-8 mt-md-1 mt-4 pe-lg-4 mx-auto">
            {/* Add space and horizontal line here */}
            <div className="my-3">
              <hr className="my-1" style={{ borderTop: "2px solid #777" }} />
            </div>

            {searched && weatherData && (
              <div className="col mb-3" id="temporaryData">
                <div
                  className="card border-0 bg-secondary text-white"
                  style={{
                    backgroundImage: backgroundImageSearched, 
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                  }}
                >
                  <div className="card-body p-3 text-white">
                    <h3 className="card-title fw-semibold">
                      {weatherData.name}({getCurrentDate()})
                    </h3>
                    <h4 className="card-text my-3 mt-3">
                      {weatherData.weather && weatherData.weather.length > 0
                        ? weatherData.weather[0].description.toUpperCase()
                        : "N/A"}
                    </h4>
                    <h6 className="card-text my-3 mt-3">
                      Temp: {weatherData.main?.temp}°C
                    </h6>
                    <h6 className="card-text my-3">
                      Wind: {(weatherData.wind?.speed * 3.6).toFixed(2)} km/h
                    </h6>
                    <h6 className="card-text my-3">
                      Humidity: {weatherData.main?.humidity}%
                    </h6>
                    <div
                      className="weather-icon-container"
                      title={weatherData.weather[0].description}
                    >
                      <img
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "100px",
                          height: "100px",
                        }}
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                        alt="Weather Icon"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-6">
              <h4 id="changeForecast" className="fw-bold my-2">
                {searched ? `Forecast in ${weatherData.name}` : "Forecast"}
              </h4>
            </div>
            <div className="col-md-6 text-end">
              <button onClick={toggleForecasts} className="btn btn-dark">
                {showMoreForecasts ? "Hide Forecasts" : "View Forecasts"}
              </button>
            </div>
          </div>

          <div
            id="changeData"
            className="days-forecast row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xl-5 d-flex justify-content-center"
          >
            {searched
              ? dailyForecastSearched.map((forecast, index) => (
                  <div className="col mb-3 text-center" key={index}>
                    {(showMoreForecasts || index < 2) && (
                      <div className="card border-0 bg-dark text-white">
                        <div className="card-body p-3 text-white">
                          <h5 className="card-title fw-semibold">
                            {new Date(forecast.dt * 1000).toLocaleDateString()}
                          </h5>
                          <div
                            className="weather-icon-container"
                            title={forecast.weather[0].description}
                          >
                            <img
                              src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                              alt="Weather Icon"
                            />
                          </div>
                          <h6 className="card-text my-3 mt-3">
                            Temp: {forecast.main?.temp}°C
                          </h6>
                          <h7 className="card-text my-3 mt-3">
                            Wind: {(forecast.wind?.speed * 3.6).toFixed(2)} km/h
                          </h7>
                          <h6 className="card-text my-3">
                            Humidity: {forecast.main?.humidity}%
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : dailyForecast.map((forecast, index) => (
                  <div className="col mb-3 text-center" key={index}>
                    {(showMoreForecasts || index < 2) && (
                      <div className="card border-0 bg-dark text-white">
                        <div className="card-body p-3 text-white">
                          <h5 className="card-title fw-semibold">
                            {new Date(forecast.dt * 1000).toLocaleDateString()}
                          </h5>
                          <div
                            className="weather-icon-container"
                            title={forecast.weather[0].description}
                          >
                            <img
                              src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                              alt="Weather Icon"
                            />
                          </div>
                          <h6 className="card-text my-3 mt-3">
                            Temp: {forecast.main?.temp}°C
                          </h6>
                          <h7 className="card-text my-3 mt-3">
                            Wind: {(forecast.wind?.speed * 3.6).toFixed(2)} km/h
                          </h7>
                          <h6 className="card-text my-3">
                            Humidity: {forecast.main?.humidity}%
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
