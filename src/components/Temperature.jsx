import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Temperature = () => {
  const [temp, setTemp] = useState(null);
  const [city, setCity] = useState("");
  const [activeInfo, setActiveInfo] = useState("");

  const infoData = {
    temperature: temp ? `Current temperature is ${temp} °C.` : "Get temperature first.",
    population: "Approx. 5–10 million people live in this region.",
    food: "Main food resources include agriculture, grains, and vegetables.",
    water: "Water resources depend on rainfall, rivers, and groundwater.",
    education: "Education facilities include schools, colleges, and universities."
  };

  const getTemperature = () => {
    if (!city) return;

    axios
      .get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: city, count: 1 }
      })
      .then(res => {
        const { latitude, longitude } = res.data.results[0];
        return axios.get("https://api.open-meteo.com/v1/forecast", {
          params: { latitude, longitude, current_weather: true }
        });
      })
      .then(res => {
        setTemp(res.data.current_weather.temperature);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <div className="head">
        <Link to="/" className="nav-link">Main Page</Link>
        <Link to="/temperature" className="nav-link">Weather</Link>
      </div>

      <h2>City Information Dashboard</h2>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="input-box"
      />

      <button className="glass-btn" onClick={getTemperature}>
        Fetch Data
      </button>

      {/* ALL BUTTONS IN ONE ROW */}
      <div className="btn-group">
        <button onClick={() => setActiveInfo("temperature")}>🌡 Temperature</button>
        <button onClick={() => setActiveInfo("population")}>👥 Population</button>
        <button onClick={() => setActiveInfo("food")}>🌾 Food</button>
        <button onClick={() => setActiveInfo("water")}>💧 Water</button>
        <button onClick={() => setActiveInfo("education")}>🎓 Education</button>
      </div>

      {/* INFO CARD */}
      {activeInfo && (
        <div className="info-card">
          <p>{infoData[activeInfo]}</p>
        </div>
      )}
    </div>
  );
};

export default Temperature;
