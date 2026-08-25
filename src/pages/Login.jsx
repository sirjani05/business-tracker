import { useState } from "react";
import { ArrowRight, LockKeyhole, Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  function submit(event) {
    event.preventDefault();
    navigate("/verify-pin", {
      state: { phone, from: location.state?.from?.pathname || "/" },
    });
  }
  return (
    <section className="auth-card">
      <div className="auth-icon">
        <LockKeyhole size={21} />
      </div>
      <p className="modal-eyebrow">WELCOME BACK</p>
      <h1>Sign in to your business</h1>
      <p className="auth-copy">
        Keep your sales, credit, and stock in one calm place.
      </p>
      <form onSubmit={submit} className="auth-form">
        <label>
          Mobile number
          <div className="input-with-icon">
            <Phone size={15} />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+263 77 000 0000"
              required
            />
          </div>
        </label>
        <button className="primary-button" type="submit">
          Continue <ArrowRight size={16} />
        </button>
      </form>
      <small className="auth-note">
        Your records stay private on this device.
      </small>
    </section>
  );
}

export default Login;
