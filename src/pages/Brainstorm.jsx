import React, { useEffect, useState } from "react";
import "../styles/brainstorm.css";
import { collection, setDoc, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthProvider";
import { FaEdit, FaTrash, FaSave, FaTimes, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";

const Brainstorm = () => {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "brainstorms"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, { includeMetadataChanges: true }, (snap) => {
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setIdeas(next);
      setLoading(false);
    }, (err) => {
      console.error("brainstorm subscribe error", err);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const refreshIdeas = async () => {
    if (!user) return;
    try {
      setRefreshing(true);
      const q = query(
        collection(db, "brainstorms"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const next = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setIdeas(next);
    } catch (e) {
      console.error(e);
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddIdea = async () => {
    const text = draft.trim();
    if (!text || !user) return;

    const pendingId = doc(collection(db, "brainstorms")).id;

    // Optimistic UI insert
    setIdeas((prev) => [
      {
        id: pendingId,
        text,
        userId: user.uid,
        createdAt: { toDate: () => new Date() },
        _pending: true,
      },
      ...prev,
    ]);

    try {
      await setDoc(doc(db, "brainstorms", pendingId), {
        userId: user.uid,
        text,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setDraft("");
      // onSnapshot will replace the optimistic item with the server one
    } catch (e) {
      console.error(e);
      // Rollback optimistic item on failure
      setIdeas((prev) => prev.filter((i) => i.id !== pendingId));
      toast.error("Failed to save idea");
    }
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (id) => {
    const text = editingText.trim();
    if (!text) return;
    try {
      await updateDoc(doc(db, "brainstorms", id), { text, updatedAt: serverTimestamp() });
      toast.success("Idea updated");
      cancelEdit();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update");
    }
  };

  const removeIdea = async (id) => {
    try {
      await deleteDoc(doc(db, "brainstorms", id));
      toast.info("Idea deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="brainstorm-container">
      <div className="brainstorm-header">
        <h2>🧠 Brainstorm</h2>
        <button className="refresh-btn" onClick={refreshIdeas} disabled={refreshing} title="Refresh ideas">
          <FaSync style={{ marginRight: 6 }} /> {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
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
          disabled={!draft.trim()}
        >
          Save Idea
        </button>
      </div>
      <div>
        <h3>Saved Ideas</h3>
        {loading ? (
          <p style={{ color: "#888" }}>Loading...</p>
        ) : ideas.length === 0 ? (
          <p style={{ color: "#888" }}>No brainstorms yet. Start drafting above!</p>
        ) : (
          <ul className="brainstorm-ideas-list">
            {ideas.map((idea) => (
              <li className="brainstorm-idea-item" key={idea.id}>
                {editingId === idea.id ? (
                  <>
                    <textarea
                      className="brainstorm-textarea"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                    />
                    <div className="brainstorm-actions">
                      <button className="action-btn save" onClick={() => saveEdit(idea.id)}><FaSave /> Save</button>
                      <button className="action-btn cancel" onClick={cancelEdit}><FaTimes /> Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="brainstorm-idea-text">{idea.text}</div>
                    <div className="brainstorm-idea-date">{idea.createdAt?.toDate ? idea.createdAt.toDate().toLocaleString() : ""}</div>
                    <div className="brainstorm-actions">
                      <button className="action-btn edit" onClick={() => startEdit(idea.id, idea.text)}><FaEdit /> Edit</button>
                      <button className="action-btn delete" onClick={() => removeIdea(idea.id)}><FaTrash /> Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brainstorm; 