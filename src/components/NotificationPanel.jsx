import { Bell, Check, CircleAlert, Eye, PackageCheck, X } from "lucide-react";

function NotificationPanel({ onClose, isCustomer }) {
  const interactionCount = JSON.parse(localStorage.getItem("vanzwe-product-interactions") || "[]").length;
  return (
    <div
      className="notification-panel"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="notification-heading">
        <div>
          <strong>Notifications</strong>
          <small>Recent updates from your business</small>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>
      {!isCustomer && <div className="notification-item">
        <span className="notification-item-icon views"><Eye size={16} /></span>
        <div><strong>{interactionCount} product interactions</strong><small>Customers have viewed or asked about your products.</small></div>
      </div>}
      {!isCustomer && <div className="notification-item">
        <span className="notification-item-icon warning">
          <CircleAlert size={16} />
        </span>
        <div>
          <strong>Credit follow-up needed</strong>
          <small>Tariro Moyo is 3 days overdue.</small>
        </div>
      </div>
      {!isCustomer && <div className="notification-item">
        <span className="notification-item-icon stock">
          <PackageCheck size={16} />
        </span>
        <div>
          <strong>Stock is running low</strong>
          <small>Review your inventory thresholds.</small>
        </div>
      </div>
      {isCustomer && <div className="notification-item">
        <span className="notification-item-icon done"><Check size={16} /></span>
        <div><strong>Browse local products</strong><small>Tap Ask provider to start a conversation.</small></div>
      </div>}
      <div className="notification-item">
        <span className="notification-item-icon done">
          <Check size={16} />
        </span>
        <div>
          <strong>Everything is synced</strong>
          <small>Your records are saved on this device.</small>
        </div>
      </div>
      <div className="notification-footer">
        <Bell size={13} /> You are all caught up
      </div>
    </div>
  );
}

export default NotificationPanel;
