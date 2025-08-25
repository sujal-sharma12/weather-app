import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);
      setForecast(null);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("city or location not found");

      const data = await res.json();
      const forecastData = await forecastRes.json();

      setWeather(data);
      setForecast(forecastData);
    } catch (err) {
      setWeather(null);
      setForecast(null);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[400px] text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src="/logo/logo.png" className="rounded-xl w-10 h-10" alt="logo" />
          <h1 className="text-3xl font-bold">Weather App</h1>
        </div>
        <p className="text-gray-400 mb-6">Good morning!</p>

        <div className="flex items-center bg-gray-700 rounded-xl overflow-hidden shadow-lg">
          <input
            type="text"
            placeholder="Enter city or location"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-white"
          />
          <button
            onClick={fetchWeather}
            className="bg-white px-4 py-4 flex items-center justify-center rounded-r-lg"
          >
            <FiSearch size={20} className="text-gray-700" />
          </button>
        </div>

        {!weather && !error && (
          <p className="text-gray-400 mt-6">
            Please enter a city to get weather details.
          </p>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {weather && (
        <div className="mt-6 flex items-center justify-between text-left bg-gray-800 rounded-2xl p-6 shadow-lg space-x-6">
          <div className="flex items-center space-x-4">
            <img
              alt="weather icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              className="w-20 h-20"
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{weather.name}</h2>
              <p className="text-4xl font-extrabold">{weather.main.temp}°C</p>
              <p className="capitalize text-gray-400">
                {weather.weather[0].description}
              </p>
            </div>
          </div>

          <div className="flex space-x-6 text-lg">
            <p>🌡️ {weather.main.feels_like}°C</p>
            <p>💧 {weather.main.humidity}%</p>
            <p>🌬️ {(weather.wind.speed * 3.6).toFixed(1)} km/h</p>
          </div>
        </div>
      )}

      {forecast && (
        <div className="mt-8 bg-gray-800 p-6 rounded-2xl shadow-lg w-[90%] max-w-3xl">
          <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {forecast.list
              .filter((item) => item.dt_txt.includes("12:00:00"))
              .map((day, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <p className="font-semibold text-sm">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <img
                    alt="forecast icon"
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    className="w-14 h-14"
                  />
                  <p className="font-bold">{Math.round(day.main.temp)}°C</p>
                  <p className="capitalize text-gray-300 text-sm text-center">
                    {day.weather[0].description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
