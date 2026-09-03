import { X } from "lucide-react";

function ProfileImageModal({ profile, onClose }) {
  const initials = profile.ownerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="profile-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="profile-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.ownerName} profile picture`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button profile-modal-close"
          onClick={onClose}
          aria-label="Close profile picture"
        >
          <X size={17} />
        </button>
        <div className="profile-modal-image">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={`${profile.ownerName} profile`}
            />
          ) : (
            initials
          )}
        </div>
        <strong>{profile.ownerName}</strong>
        <small>{profile.businessName}</small>
      </section>
    </div>
  );
}

export default ProfileImageModal;
