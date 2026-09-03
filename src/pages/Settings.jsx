import { useEffect, useState } from "react";
import CustomerSettingsForm from "../components/CustomerSettingsForm";
import SettingsForm from "../components/SettingsForm";
import ProfileImageModal from "../components/ProfileImageModal";

function Settings({ profile, onSave, role }) {
  const [saved, setSaved] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);
  function saveProfile(nextProfile) {
    onSave({ ...profile, ...nextProfile, role });
    setSaved(true);
  }
  return (
    <div className="settings-page">
      <section className="welcome-row">
        <div>
          <h2>Settings</h2>
          <p>
            {role === "customer"
              ? "Keep your personal details ready for local providers."
              : "Make Vamwe Biz OS feel like your business."}
          </p>
        </div>
        <div className={`settings-status ${online ? "online" : "offline"}`}>
          <span className="status-dot" /> {online ? "Online" : "Offline"}
        </div>
      </section>
      <div className="settings-layout">
        <section className="settings-intro">
          <button
            className="profile-holder settings-profile-avatar"
            onClick={() => setProfileModalOpen(true)}
            aria-label="View profile picture"
          >
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
          </button>
          <h3>{profile.ownerName}</h3>
          <p>{profile.businessName}</p>
          <small>Your information stays on this device.</small>
        </section>
        {role === "customer" ? (
          <CustomerSettingsForm
            profile={{ ...profile, saved }}
            onSave={saveProfile}
          />
        ) : (
          <SettingsForm profile={{ ...profile, saved }} onSave={saveProfile} />
        )}
      </div>
      {profileModalOpen && (
        <ProfileImageModal
          profile={profile}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Settings;
