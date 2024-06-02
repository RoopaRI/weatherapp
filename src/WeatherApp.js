import React, { useState, useEffect } from "react";
import "./WeatherApp.css";
import axios from "axios";

export default function WeatherApp() {
  const [city, setCity] = useState({ Key: "5101462987974e8f96a51803242903", q: "" });
  const [weatherData, setWeatherData] = useState(null);
  const [flag, setFlag] = useState(false);

  const handleSearch = () => {
    if (city.q.trim() !== "") {
      setFlag(prev => !prev);
    } else {
      alert("Please enter a city name.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (city.q.trim() === "") return; // Avoid making a request if city.q is empty

      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${city.Key}&q=${city.q}`);
        setWeatherData(response.data);
      } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 403 || e.response.status === 400) {
            alert("Failed to fetch weather data. Please check the city name.");
        }
      }
    };

    if (flag) {
      fetchData();
    }
  }, [flag, city]);

  return (
    <div>
      <input
        className="input"
        placeholder="Enter city name"
        name="text"
        value={city.q}
        onChange={(e) => setCity({ ...city, q: e.target.value })}
        required
      />
      <button className="btn" onClick={handleSearch}>Search</button>

      {flag ? (
                weatherData ? (
                    <div className="weather-cards">
                        <div className="weather-card">
                            <h4>Temperature</h4>
                            <p>{weatherData.current.temp_c}°C</p>
                        </div>
                        <div className="weather-card">
                            <h4>Humidity</h4>
                            <p>{weatherData.current.humidity}%</p>
                        </div>
                        <div className="weather-card">
                            <h4>Condition</h4>
                            <p>{weatherData.current.condition.text}</p>
                        </div>
                        <div className="weather-card">
                            <h4>Wind Speed</h4>
                            <p>{weatherData.current.wind_kph}kph</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading data...</p>
                )
            ) : null}
    </div>
  );
}