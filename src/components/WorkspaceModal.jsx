import { Building2, ChevronRight, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function WorkspaceModal({ profile, onClose }) {
  return (
    <div
      className="workspace-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="workspace-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="workspace-modal-header">
          <div className="workspace-modal-icon">
            <Building2 size={19} />
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close workspace actions"
          >
            <X size={18} />
          </button>
        </div>
        <p className="modal-eyebrow">CURRENT WORKSPACE</p>
        <h2 id="workspace-modal-title">{profile.businessName}</h2>
        <p className="workspace-modal-location">{profile.location}</p>
        <div className="workspace-modal-actions">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="workspace-cta primary-cta"
          >
            <span>
              <strong>Manage business details</strong>
              <small>Update your owner and shop information</small>
            </span>
            <ChevronRight size={17} />
          </NavLink>
          <a
            href="https://wa.me/263718009932"
            target="_blank"
            rel="noreferrer"
            className="workspace-cta secondary-cta"
            onClick={onClose}
          >
            <span>
              <strong>
                <FaWhatsapp size={15} /> Contact support
              </strong>
              <small>Chat with the Vamwe Biz OS team</small>
            </span>
            <ChevronRight size={17} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default WorkspaceModal;
