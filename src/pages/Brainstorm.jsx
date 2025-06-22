import React, { useState } from "react";
import "../styles/brainstorm.css";

const Brainstorm = () => {
  const [draft, setDraft] = useState("");
  const [ideas, setIdeas] = useState([]);

  const handleAddIdea = () => {
    if (draft.trim()) {
      setIdeas([{ text: draft, date: new Date() }, ...ideas]);
      setDraft("");
    }
  };

  return (
    <div className="brainstorm-container">
      <h2>🧠 Brainstorm</h2>
      <p>Draft your ideas, plans, or notes here. Save them for later inspiration!</p>
      <div style={{ marginBottom: 16 }}>
        <textarea
          className="brainstorm-textarea"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type your idea here..."
          rows={4}
        />
        <button
          className="brainstorm-save-btn"
          onClick={handleAddIdea}
        >
          Save Idea
        </button>
      </div>
      <div>
        <h3>Saved Ideas</h3>
        {ideas.length === 0 ? (
          <p style={{ color: "#888" }}>No brainstorms yet. Start drafting above!</p>
        ) : (
          <ul className="brainstorm-ideas-list">
            {ideas.map((idea, idx) => (
              <li className="brainstorm-idea-item" key={idx}>
                <div className="brainstorm-idea-text">{idea.text}</div>
                <div className="brainstorm-idea-date">{idea.date.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brainstorm; 