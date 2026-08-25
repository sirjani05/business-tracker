import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  LockKeyhole,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { FaGoogle, FaWhatsapp } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const customerDefaults = {
  username: "",
  phone: "",
  pin: "",
  confirmPin: "",
  location: "",
  age: "",
  gender: "",
  profileImage: "",
};
const providerDefaults = {
  username: "",
  phone: "",
  password: "",
  confirmPassword: "",
  businessName: "",
  businessLocation: "",
  age: "",
  gender: "",
  profileImage: "",
  email: "",
};

function Login() {
  const [role, setRole] = useState("provider");
  const [customer, setCustomer] = useState(customerDefaults);
  const [provider, setProvider] = useState(providerDefaults);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const form = role === "customer" ? customer : provider;
  function updateField(event) {
    const { name, value } = event.target;
    if (role === "customer") setCustomer({ ...customer, [name]: value });
    else setProvider({ ...provider, [name]: value });
    setError("");
  }
  function updateImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      role === "customer"
        ? setCustomer({ ...customer, profileImage: reader.result })
        : setProvider({ ...provider, profileImage: reader.result });
    reader.readAsDataURL(file);
  }
  function submit(event) {
    event.preventDefault();
    const isCustomer = role === "customer";
    const requiredFields = isCustomer
      ? [
          form.username,
          form.phone,
          form.pin,
          form.confirmPin,
          form.location,
          form.age,
          form.gender,
          form.profileImage,
        ]
      : [
          form.username,
          form.phone,
          form.password,
          form.confirmPassword,
          form.businessName,
          form.businessLocation,
          form.age,
          form.gender,
          form.profileImage,
        ];
    if (requiredFields.some((value) => !String(value || "").trim())) {
      setError(
        "Complete every field, including your profile image, before continuing.",
      );
      return;
    }
    if (!isCustomer && !form.email.trim()) {
      setError(
        "Add an email address or choose Continue with Google before continuing.",
      );
      return;
    }
    const secretMatches = isCustomer
      ? form.pin === form.confirmPin
      : form.password === form.confirmPassword;
    if (!secretMatches) {
      setError(isCustomer ? "PINs do not match." : "Passwords do not match.");
      return;
    }
    const profile = isCustomer
      ? {
          ownerName: form.username,
          businessName: "Vamwe Biz OS",
          location: form.location,
          residence: form.location,
          phone: form.phone,
          age: form.age,
          gender: form.gender,
          profileImage: form.profileImage,
          role,
        }
      : {
          ownerName: form.username,
          businessName: form.businessName,
          location: form.businessLocation,
          phone: form.phone,
          email: form.email,
          age: form.age,
          gender: form.gender,
          profileImage: form.profileImage,
          currency: "USD",
          role,
        };
    localStorage.setItem("vanzwe-profile", JSON.stringify(profile));
    localStorage.setItem("vanzwe-authenticated", "true");
    localStorage.setItem("vanzwe-role", role);
    navigate(location.state?.from?.pathname || "/", { replace: true });
  }
  return (
    <section className="auth-card">
      <div className="auth-icon">
        <LockKeyhole size={21} />
      </div>
      <p className="modal-eyebrow">WELCOME TO VAMWE BIZ OS</p>
      <h1>Choose your sign in</h1>
      <p className="auth-copy">
        Create your profile once, then keep your business or customer records in
        one calm place.
      </p>
      <div className="role-switcher" role="tablist" aria-label="Account type">
        <button
          type="button"
          className={role === "provider" ? "role-tab active" : "role-tab"}
          onClick={() => {
            setRole("provider");
            setError("");
          }}
          role="tab"
          aria-selected={role === "provider"}
        >
          <BriefcaseBusiness size={15} /> Service provider
        </button>
        <button
          type="button"
          className={role === "customer" ? "role-tab active" : "role-tab"}
          onClick={() => {
            setRole("customer");
            setError("");
          }}
          role="tab"
          aria-selected={role === "customer"}
        >
          <UserRound size={15} /> Customer
        </button>
      </div>
      <form onSubmit={submit} className="auth-form">
        <div className="auth-form-grid">
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={updateField}
              placeholder={
                role === "customer" ? "e.g. rudo_moyo" : "e.g. Tendai Moyo"
              }
              required
            />
          </label>
          <label>
            Phone number
            <div className="input-with-icon">
              <Phone size={15} />
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+263 77 000 0000"
                required
              />
            </div>
          </label>
        </div>
        {role === "customer" ? (
          <>
            <div className="auth-form-grid">
              <label>
                PIN
                <input
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength="4"
                  value={form.pin}
                  onChange={updateField}
                  placeholder="4 digits"
                  required
                />
              </label>
              <label>
                Confirm PIN
                <input
                  name="confirmPin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength="4"
                  value={form.confirmPin}
                  onChange={updateField}
                  placeholder="Repeat PIN"
                  required
                />
              </label>
            </div>
            <div className="auth-form-grid">
              <label>
                Location of residence
                <div className="input-with-icon">
                  <MapPin size={15} />
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="e.g. Mbare, Harare"
                    required
                  />
                </div>
              </label>
              <label>
                Age
                <input
                  name="age"
                  type="number"
                  min="13"
                  max="120"
                  value={form.age}
                  onChange={updateField}
                  placeholder="Age"
                  required
                />
              </label>
            </div>
            <label>
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={updateField}
                required
              >
                <option value="">Choose gender</option>
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <div className="auth-form-grid">
              <label>
                Business name
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={updateField}
                  placeholder="e.g. Tendai's Market"
                  required
                />
              </label>
              <label>
                Business location
                <div className="input-with-icon">
                  <MapPin size={15} />
                  <input
                    name="businessLocation"
                    value={form.businessLocation}
                    onChange={updateField}
                    placeholder="e.g. Harare, Zimbabwe"
                    required
                  />
                </div>
              </label>
            </div>
            <div className="auth-form-grid">
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Create password"
                  required
                />
              </label>
              <label>
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Repeat password"
                  required
                />
              </label>
            </div>
            <div className="auth-form-grid">
              <label>
                Age
                <input
                  name="age"
                  type="number"
                  min="18"
                  max="120"
                  value={form.age}
                  onChange={updateField}
                  placeholder="Age"
                  required
                />
              </label>
              <label>
                Gender
                <select
                  name="gender"
                  value={form.gender}
                  onChange={updateField}
                  required
                >
                  <option value="">Choose gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
            </div>
            <label>
              Email address{" "}
              <span className="optional">or continue with Google</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
              />
            </label>
            <button
              className="google-button"
              type="button"
              onClick={() => {
                setProvider({
                  ...provider,
                  email: "google-account@demo.local",
                });
                setError("");
              }}
            >
              <FaGoogle size={14} /> Continue with Google
            </button>
          </>
        )}
        <label className="profile-upload">
          <span className="profile-upload-label">
            <Camera size={16} /> Profile image <small>required</small>
          </span>
          <input type="file" accept="image/*" onChange={updateImage} />
          <span className="upload-preview">
            {form.profileImage ? (
              <img src={form.profileImage} alt="Profile preview" />
            ) : (
              <UserRound size={18} />
            )}
          </span>
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" type="submit">
          {role === "customer"
            ? "Create customer profile"
            : "Create provider profile"}{" "}
          <ArrowRight size={16} />
        </button>
      </form>
      <a
        className="auth-support"
        href="https://wa.me/263718009932"
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp size={15} /> Need help? Chat on WhatsApp
      </a>
      <small className="auth-note">
        Your profile and records stay private on this device.
      </small>
    </section>
  );
}

export default Login;
