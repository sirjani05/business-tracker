import { useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

function VerifyPin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  function submit(event) {
    event.preventDefault();
    localStorage.setItem("vanzwe-authenticated", "true");
    navigate(location.state?.from || "/", { replace: true });
  }
  return (
    <section className="auth-card">
      <NavLink className="auth-back" to="/login">
        <ArrowLeft size={15} /> Change number
      </NavLink>
      <div className="auth-icon">
        <LockKeyhole size={21} />
      </div>
      <p className="modal-eyebrow">SECURE ACCESS</p>
      <h1>Enter your PIN</h1>
      <p className="auth-copy">
        Use your 4-digit owner PIN to open your workspace.
      </p>
      <form onSubmit={submit} className="auth-form">
        <label>
          Owner PIN
          <input
            className="pin-input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength="4"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="••••"
            required
          />
        </label>
        <button
          className="primary-button"
          type="submit"
          disabled={pin.length !== 4}
        >
          Open workspace <CheckCircle2 size={16} />
        </button>
      </form>
      <small className="auth-note">Demo mode accepts any 4-digit PIN.</small>
    </section>
  );
}

export default VerifyPin;
