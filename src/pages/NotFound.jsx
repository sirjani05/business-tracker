import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found">
      <div className="empty-icon">
        <Compass size={24} />
      </div>
      <p className="modal-eyebrow">404</p>
      <h1>That page is not here</h1>
      <p>Return to your business overview and keep moving.</p>
      <Link className="primary-button" to="/">
        Go to dashboard
      </Link>
    </main>
  );
}

export default NotFound;
