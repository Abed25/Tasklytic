import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "../styles/calender.css";

export default function Milestones() {
  const navigate = useNavigate();

  const handleDateClick = (arg) => {
    const date = new Date(arg.dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const formatted = `${day}-${month}-${year}`;

    navigate(`/milestones/${formatted}`);
  };

  return (
    <div>
      <h2>Milestones</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={[
          { title: "Meeting", date: "2025-05-12" },
          { title: "Project Due", date: "2025-05-15" },
        ]}
      />
    </div>
  );
}
