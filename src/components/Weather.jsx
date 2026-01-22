import React, { useEffect, useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Weather = () => {
  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState("");
  const [show, setShow] = useState(true);
  const [datafound, setDatafound] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const handleEnter = (e, city) => {
    if (e.key === "Enter"&&city.length>=3) {
      handleSearch(city);
    }
  };

  const handleSearch = async (city) => {
    try {
      console.log("API KEY:", API_KEY);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);

      const data = await response.json();

      console.log(data);
      if (!response.ok) {
        setWeatherData({
          message: data.message,
        });
        setShow(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      console.log(weatherData.humidity);

      setDatafound(true);
      setShow(true);
    } catch (error) {
      setShow(false);

      console.log("Error in fetching weather data");
    }
  };
  // useEffect(() => {
  //   search("London");
  // }, []);

  return (
    <div className="weather">
      <div className="searchbar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search"
          onKeyDown={(e) => handleEnter(e, city)}
        />
        <button onClick={() => handleSearch(city)} disabled={city.length < 3}>
          <img src={search_icon} alt="Button" />
        </button>
      </div>
      {show ? (
        datafound ? (
          <>
            <img src={weatherData.icon} alt="" className="weather_icon" />
            <p className="temperature">{weatherData.temperature}°c</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} Km/Hr</p>
                  <span>WindSpeed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )
      ) : (
        <>
          <p>{weatherData.message}</p>
        </>
      )}
    </div>
  );
};

export default Weather;
