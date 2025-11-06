import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/theme.css";
import LoadingIndicator from "./LoadingIndicator.jsx";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

        return (
            <div className="container" style={{ maxWidth: 520 }}>
                <form onSubmit={handleSubmit} className="card padded">
                    <h1 style={{ marginBottom: 8 }}>{name}</h1>
                    <p style={{ color: "var(--color-text-muted)", marginBottom: 18 }}>Welcome back. Please enter your credentials.</p>
                    <label className="label">Username</label>
                    <input
                        className="input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourname"
                    />
                    <label className="label">Password</label>
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    {loading && <LoadingIndicator />}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                        <button className="btn btn-primary" type="submit">{name}</button>
                    </div>
                </form>
            </div>
        );
}

export default Form