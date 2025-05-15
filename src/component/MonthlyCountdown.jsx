import React, { useEffect, useState } from "react";

const MonthlyCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const getOrSetEndOfMonth = () => {
      const stored = localStorage.getItem("endOfMonth");
      const now = new Date();

      if (stored) {
        const storedDate = new Date(stored);
        if (storedDate.getMonth() === now.getMonth() && storedDate > now) {
          return storedDate;
        }
      }

      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      end.setSeconds(end.getSeconds() - 1);
      localStorage.setItem("endOfMonth", end.toISOString());
      return end;
    };

    const endOfMonth = getOrSetEndOfMonth();

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
    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
      {pad(timeLeft.days)} : {pad(timeLeft.hours)} : {pad(timeLeft.minutes)} :{" "}
      {pad(timeLeft.seconds)}
    </div>
  );
};

export default MonthlyCountdown;
