import { useEffect, useState } from "react";
import api from "../api";
import "../styles/theme.css";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function Analytics() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/analytics/notes/daily/")
      .then((res) => res.data)
      .then((data) => {
        setSeries(data.series || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container"><div className="loader" /></div>;
  if (error) return <div style={{ color: "red" }}>Error: {String(error)}</div>;

  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card padded">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2>Notes created per day</h2>
          <span style={{ color: "var(--color-text-muted)" }}>Last 14 days</span>
        </div>
        <div style={{ height: 260, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-elev-2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="url(#lineGradient)" strokeWidth={3} dot={{ r: 3, stroke: "var(--color-bg)", strokeWidth: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card padded">
        <h2>Raw data</h2>
        <div style={{ overflowX: "auto", marginTop: 8 }}>
          <table style={{ borderCollapse: "collapse", minWidth: 400, width: "100%" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left", padding: 8 }}>Date</th>
                <th style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left", padding: 8 }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {series.map((row) => (
                <tr key={row.date}>
                  <td style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: 8 }}>{row.date}</td>
                  <td style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: 8 }}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Analytics;
