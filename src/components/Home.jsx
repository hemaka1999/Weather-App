import React, { useState, useEffect } from 'react';

// Define your API key and endpoint from OpenWeatherMap
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const API_ENDPOINT = 'https://api.openweathermap.org/data/2.5';

function WeatherDetails() {
  const [colomboWeather, setColomboWeather] = useState({});
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  // Function to fetch the weather for Colombo
  const fetchColomboWeather = () => {
    fetch(`${API_ENDPOINT}/weather?q=Colombo&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setColomboWeather(data));
  };

  // Function to fetch weather for a specified latitude and longitude
  const fetchWeatherByCoordinates = () => {
    fetch(`${API_ENDPOINT}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  };

  useEffect(() => {
    // Fetch the weather for Colombo when the component mounts
    fetchColomboWeather();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherByCoordinates();
  };

  return (
    <div>
      <h1>Weather Details</h1>

      <div>
        <h2>Weather in Colombo</h2>
        {colomboWeather.weather && (
          <div>
            <p>Temperature: {colomboWeather.main.temp} K</p>
            <p>Humidity: {colomboWeather.main.humidity} %</p>
            <p>Wind Speed: {colomboWeather.wind.speed} m/s</p>
          </div>
        )}
      </div>

      <div>
        <h2>Search by Latitude and Longitude</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {weatherData && (
          <div>
            <h3>Weather at Latitude: {weatherData.coord.lat}, Longitude: {weatherData.coord.lon}</h3>
            <p>Temperature: {weatherData.main.temp} K</p>
            <p>Humidity: {weatherData.main.humidity} %</p>
            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDetails;
