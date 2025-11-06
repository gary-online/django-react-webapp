import React from "react";
import "../styles/theme.css";

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

        return (
            <div className="card note-card">
                <p className="note-title">{note.title}</p>
                <p className="note-content">{note.content}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <p className="note-date">{formattedDate}</p>
                    <button className="btn btn-danger" onClick={() => onDelete(note.id)}>
                        Delete
                    </button>
                </div>
            </div>
        );
}

export default Note