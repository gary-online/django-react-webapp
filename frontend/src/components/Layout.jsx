import { Link } from "react-router-dom";
import "../styles/theme.css";

function Layout({ children }) {
  return (
    <div>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-badge" />
            <Link to="/">SMB Analytics</Link>
          </div>
          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/">Home</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/logout" className="btn btn-ghost">Logout</Link>
          </nav>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}

export default Layout;
