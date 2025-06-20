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
      const currentMonthLabel = now.toLocaleString("default", { month: "long" });
      let nextMonth, nextYear;
      if (now.getMonth() === 11) { // December
        nextMonth = 0;
        nextYear = now.getFullYear() + 1;
      } else {
        nextMonth = now.getMonth() + 1;
        nextYear = now.getFullYear();
      }
      const nextMonthDate = new Date(nextYear, nextMonth, 1);
      const end = new Date(nextMonthDate);
      end.setSeconds(end.getSeconds() - 1);
      const nextMonthLabel = nextMonthDate.toLocaleString("default", { month: "long" });
      setNextMonthLabel(
        `To ${nextMonthLabel} ${nextMonthDate.getFullYear()}`
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
        const currentMonthLabel = now.toLocaleString("default", { month: "long" });
        let nextMonth, nextYear;
        if (now.getMonth() === 11) {
          nextMonth = 0;
          nextYear = now.getFullYear() + 1;
        } else {
          nextMonth = now.getMonth() + 1;
          nextYear = now.getFullYear();
        }
        const nextMonthDate = new Date(nextYear, nextMonth, 1);
        const nextMonthLabel = nextMonthDate.toLocaleString("default", { month: "long" });
        setNextMonthLabel(
          `To ${nextMonthLabel} ${nextMonthDate.getFullYear()}`
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
    <div className="monthly-countdown digital-countdown">
      <div className="countdown-row">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div className="countdown-unit" key={unit}>
            <div className="countdown-value">{pad(timeLeft[unit])}</div>
            <div className="countdown-label">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
          </div>
        ))}
      </div>
      <div className="countdown-footer">{nextMonthLabel}</div>
    </div>
  );
};

export default MonthlyCountdown;
