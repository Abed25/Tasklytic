import React, { useEffect, useState } from "react";

const MonthlyCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextMonthLabel, setNextMonthLabel] = useState("");

  useEffect(() => {
    const getOrSetEndOfMonth = () => {
      const now = new Date();
      const year =
        now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
      const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1;

      const nextMonthDate = new Date(year, month, 1);
      const end = new Date(nextMonthDate);
      end.setSeconds(end.getSeconds() - 1);

      setNextMonthLabel(
        `${nextMonthDate.toLocaleString("default", {
          month: "long",
        })}, ${nextMonthDate.getFullYear()}`
      );

      localStorage.setItem("endOfMonth", end.toISOString());
      return end;
    };

    const stored = localStorage.getItem("endOfMonth");
    const now = new Date();
    let endOfMonth;

    if (stored) {
      const storedDate = new Date(stored);
      if (storedDate > now) {
        endOfMonth = storedDate;
        setNextMonthLabel(
          `${storedDate.toLocaleString("default", {
            month: "long",
          })}, ${storedDate.getFullYear()}`
        );
      } else {
        endOfMonth = getOrSetEndOfMonth();
      }
    } else {
      endOfMonth = getOrSetEndOfMonth();
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = endOfMonth - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        localStorage.removeItem("endOfMonth");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => String(num).padStart(2, "0");

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit}>
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {pad(timeLeft[unit])}
            </div>
            <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>{" "}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "12px", fontSize: "1rem", color: "#555" }}>
        {nextMonthLabel}
      </div>
    </div>
  );
};

export default MonthlyCountdown;
