import { useState } from "react";
import axios from "axios";
import "../components/styles.css";

function Temperature() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [wikiData, setWikiData] = useState("");
  const [section, setSection] = useState("weather"); 
  // weather | population | water | education | food

  const fetchAllData = async () => {
    if (!city) return;

    try {
      // WEATHER (Open-Meteo)
      const geo = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: city, count: 1 } }
      );

      const { latitude, longitude } = geo.data.results[0];

      const weatherRes = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude,
            longitude,
            current_weather: true,
          },
        }
      );

      setWeather(weatherRes.data.current_weather.temperature);

      // WIKIPEDIA DATA (common for all cities)
      const wiki = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
      );
      setWikiData(wiki.data.extract);
    } catch (err) {
      setWikiData("No data found for this city.");
      setWeather(null);
    }
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="head">
        <h2>🌍 City Resources Dashboard</h2>
      </div>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <br /><br />

      <button onClick={fetchAllData}>Fetch Data</button>

      <br /><br />

      {/* NAV BUTTONS */}
      <div className="nav-btns">
        <button onClick={() => setSection("weather")}>🌦 Weather</button>
        <button onClick={() => setSection("population")}>👥 Population</button>
        <button onClick={() => setSection("water")}>💧 Water</button>
        <button onClick={() => setSection("education")}>🎓 Education</button>
        <button onClick={() => setSection("food")}>🍲 Food</button>
      </div>

      <br />

      {/* CARD */}
      <div className="card big-card">
        {section === "weather" && weather !== null && (
          <>
            <h3>🌦 Weather</h3>
            <h1>{weather} °C</h1>
          </>
        )}

        {section === "population" && (
          <>
            <h3>👥 Population</h3>
            <p>
              Population details of <b>{city}</b> are available in census data.
            </p>
          </>
        )}

        {section === "water" && (
          <>
            <h3>💧 Water Resources</h3>
            <p>
              Rivers, reservoirs, groundwater and drinking water facilities of{" "}
              <b>{city}</b>.
            </p>
          </>
        )}

        {section === "education" && (
          <>
            <h3>
              🎓 Education
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                width="30"
                style={{ marginLeft: "10px" }}
              />
            </h3>
            <p>
              Major schools, colleges and universities in <b>{city}</b>.
            </p>
          </>
        )}

        {section === "food" && (
          <>
            <h3>
              🍲 Food
              <img
                src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                width="30"
                style={{ marginLeft: "10px" }}
              />
            </h3>
            <p>
              Famous local food, cuisine and restaurants of <b>{city}</b>.
            </p>
          </>
        )}
      </div>

      <br />

      {/* EXTRA INFO */}
      {wikiData && (
        <div className="card">
          <h3>📘 About {city}</h3>
          <p>{wikiData}</p>
        </div>
      )}
    </div>
  );
}

export default Temperature;
