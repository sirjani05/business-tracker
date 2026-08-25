import { useState } from "react";
import SettingsForm from "../components/SettingsForm";

function Settings({ profile, onSave }) {
  const [saved, setSaved] = useState(false);
  function saveProfile(nextProfile) {
    onSave(nextProfile);
    setSaved(true);
  }
  return (
    <div className="settings-page">
      <section className="welcome-row">
        <div>
          <h2>Settings</h2>
          <p>Make Vamwe Biz OS feel like your business.</p>
        </div>
        <div className="settings-status">
          <span className="status-dot" /> Offline-first
        </div>
      </section>
      <div className="settings-layout">
        <section className="settings-intro">
          <div className="settings-profile-avatar">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.ownerName} profile`}
              />
            ) : (
              profile.ownerName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>
          <h3>{profile.ownerName}</h3>
          <p>{profile.businessName}</p>
          <small>Your information stays on this device.</small>
        </section>
        <SettingsForm profile={{ ...profile, saved }} onSave={saveProfile} />
      </div>
    </div>
  );
}

export default Settings;
