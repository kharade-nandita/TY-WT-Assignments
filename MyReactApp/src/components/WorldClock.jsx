import { useState, useEffect } from "react";

function WorldClock() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (zone) => {
    return time.toLocaleTimeString("en-US", {
      timeZone: zone,
      hour12: !is24Hour,
    });
  };

  const leftCountries = [
    { name: "India", flag: "🇮🇳", zone: "Asia/Kolkata" },
    { name: "UK", flag: "🇬🇧", zone: "Europe/London" },
    { name: "Africa", flag: "", zone: "Africa/Lagos" },
  ];

  const rightCountries = [
    { name: "USA", flag: "🇺🇸", zone: "America/New_York" },
    { name: "Japan", flag: "🇯🇵", zone: "Asia/Tokyo" },
    { name: "Australia", flag: "🇦🇺", zone: "Australia/Sydney" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h2>⏰ World Clock</h2>

      {/* Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setIs24Hour(false)}>12 Hour</button>
        <button onClick={() => setIs24Hour(true)} style={{ marginLeft: "10px" }}>
          24 Hour
        </button>
      </div>

      {/* Layout */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          {leftCountries.map((c, i) => (
            <p key={i}>
              {c.flag} {c.name}: {formatTime(c.zone)}
            </p>
          ))}
        </div>

        {/* CENTER UTC */}
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>
          🌐 UTC: {formatTime("UTC")}
        </div>

        {/* RIGHT SIDE */}
        <div>
          {rightCountries.map((c, i) => (
            <p key={i}>
              {c.flag} {c.name}: {formatTime(c.zone)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorldClock;