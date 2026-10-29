import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="login-page">
      <div className="card login-card" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p className="muted">That page doesn&apos;t exist.</p>
        <Link to="/" className="btn btn-primary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
