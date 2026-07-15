import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="center-page">
      <section>
        <h1>404</h1>
        <p>The page you requested does not exist.</p>
        <Link to="/">Return home</Link>
      </section>
    </main>
  );
}