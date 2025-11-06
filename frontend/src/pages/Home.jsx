import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Note from "../components/Note.jsx";
import "../styles/theme.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

        return (
            <div className="grid" style={{ gap: 24 }}>
                <section className="card padded">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h2>Your Notes</h2>
                        <Link to="/analytics" className="btn btn-ghost">View Analytics</Link>
                    </div>
                    {notes.length === 0 ? (
                        <div className="empty-state">
                            <h3>No notes yet</h3>
                            <p style={{ color: "var(--color-text-muted)" }}>Create your first note using the form below.</p>
                        </div>
                    ) : (
                        <div className="grid notes">
                            {notes.map((note) => (
                                <Note note={note} onDelete={deleteNote} key={note.id} />
                            ))}
                        </div>
                    )}
                </section>
                <section className="card padded">
                    <h2>Create a Note</h2>
                    <form onSubmit={createNote} style={{ marginTop: 12 }}>
                        <label className="label" htmlFor="title">Title</label>
                        <input
                            className="input"
                            type="text"
                            id="title"
                            name="title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder="Give it a catchy title"
                        />
                        <label className="label" htmlFor="content">Content</label>
                        <textarea
                            className="textarea"
                            id="content"
                            name="content"
                            rows={4}
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your thoughts..."
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                            <button className="btn btn-primary" type="submit">Save Note</button>
                        </div>
                    </form>
                </section>
            </div>
        );
}

export default Home;