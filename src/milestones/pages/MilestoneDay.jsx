import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/milestones.css";

function MilestoneDay() {
  const { date } = useParams(); // Get the date from the URL
  const [milestone, setMilestone] = useState({ title: "", description: "" });
  const [milestonesList, setMilestonesList] = useState([]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMilestone((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit the form and add the milestone to the list
  const handleSubmit = (e) => {
    e.preventDefault();
    if (milestone.title && milestone.description) {
      setMilestonesList((prev) => [...prev, { ...milestone, date }]);
      setMilestone({ title: "", description: "" }); // Reset form after submission
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Milestones for: {date}</h2>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={milestone.title}
              onChange={handleInputChange}
              placeholder="Enter milestone title"
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={milestone.description}
              onChange={handleInputChange}
              placeholder="Enter milestone description"
              required
            />
          </div>
          <button type="submit">Add Milestone</button>
        </form>
      </div>

      {/* Display List of Milestones for the selected day */}
      <h3>Milestones for {date}</h3>
      <ul>
        {milestonesList.map((milestone, index) => (
          <li key={index}>
            <strong>{milestone.title}</strong>: {milestone.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MilestoneDay;
