import React, { useEffect, useState } from 'react';

const pad = (n) => n.toString().padStart(2, '0');

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="digital-clock">
      <span className="clock-time">{hours}:{minutes}:{seconds}</span>
      <span className="clock-date">{dateStr}</span>
    </div>
  );
} 