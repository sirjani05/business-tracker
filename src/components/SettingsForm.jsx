import {
  Building2,
  Camera,
  Check,
  Mail,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

function SettingsForm({ profile, onSave }) {
  const [profileImage, setProfileImage] = useState(profile.profileImage || "");
  function updateImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  }
  return (
    <form
      className="settings-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          ...Object.fromEntries(new FormData(event.currentTarget)),
          profileImage,
        });
      }}
    >
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-section-icon">
            <UserRound size={18} />
          </div>
          <div>
            <h3>Owner profile</h3>
            <p>These details identify you inside the workspace.</p>
          </div>
        </div>
        <div className="settings-form-grid">
          <label className="profile-image-field">
            Profile picture
            <div className="profile-image-picker">
              <div className="settings-profile-avatar small">
                {profileImage ? (
                  <img src={profileImage} alt="Profile preview" />
                ) : (
                  <Camera size={18} />
                )}
              </div>
              <input
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={updateImage}
              />
              {profileImage && (
                <button
                  type="button"
                  className="profile-image-remove"
                  onClick={() => setProfileImage("")}
                  aria-label="Remove profile picture"
                  title="Remove profile picture"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </label>
          <label>
            Full name
            <input
              name="ownerName"
              defaultValue={profile.ownerName}
              placeholder="e.g. Tendai Moyo"
              required
            />
          </label>
          <label>
            Phone number
            <div className="input-with-icon">
              <Phone size={15} />
              <input
                name="phone"
                defaultValue={profile.phone}
                placeholder="+263 77 000 0000"
              />
            </div>
          </label>
          <label>
            Email address
            <div className="input-with-icon">
              <Mail size={15} />
              <input
                name="email"
                type="email"
                defaultValue={profile.email}
                placeholder="you@example.com"
              />
            </div>
          </label>
        </div>
      </section>
      <section className="settings-section">
        <div className="settings-section-heading">
          <div className="settings-section-icon">
            <Building2 size={18} />
          </div>
          <div>
            <h3>Business details</h3>
            <p>Keep your shop information clear and consistent.</p>
          </div>
        </div>
        <div className="settings-form-grid">
          <label>
            Business name
            <input
              name="businessName"
              defaultValue={profile.businessName}
              placeholder="e.g. Tendai's Market"
              required
            />
          </label>
          <label>
            Business location
            <input
              name="location"
              defaultValue={profile.location}
              placeholder="e.g. Harare, Zimbabwe"
            />
          </label>
          <label>
            Preferred currency
            <select name="currency" defaultValue={profile.currency}>
              <option value="USD">USD</option>
              <option value="ZiG">ZiG</option>
            </select>
          </label>
        </div>
      </section>
      <div className="settings-actions">
        <button className="primary-button" type="submit">
          <Save size={16} /> Save changes
        </button>
        {profile.saved && (
          <span className="settings-saved">
            <Check size={15} /> Changes saved on this device
          </span>
        )}
      </div>
    </form>
  );
}

export default SettingsForm;
