import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (cityName = city) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setCity("");

        // Update search history
        setHistory((prev) => {
          const updated = [data.name, ...prev.filter((c) => c !== data.name)];
          return updated.slice(0, 5);
        });
      } else {
        setWeather(null);
        alert(data.message || "City not found!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-blue-300 to-indigo-500 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition duration-300">

        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="bg-white dark:bg-gray-700 text-black dark:text-white px-4 py-1 rounded text-sm shadow"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Weather Card */}
        <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-lg p-6 text-center transition-all duration-300">
          <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>

          {/* Input & Button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Enter city"
              className="flex-1 border p-2 rounded text-black"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => fetchWeather()}
            >
              Search
            </button>
          </div>

          {/* Search History */}
          {history.length > 0 && (
            <div className="mb-6 text-left">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recent Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    className="bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    onClick={() => fetchWeather(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Message */}
          {loading && (
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-4">Fetching weather...</p>
          )}

          {/* Weather Info */}
          {weather && weather.main && (
            <div className="mt-4 text-gray-700 dark:text-gray-200">
              <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather Icon"
                className="mx-auto my-2"
              />
              <p className="text-lg">Temperature: {weather.main.temp}°C</p>
              <p>Weather: {weather.weather[0].main}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} km/h</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;