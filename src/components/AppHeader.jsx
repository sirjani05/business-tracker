import { useState } from "react";
import { Bell, ChevronDown, Menu, Plus } from "lucide-react";
import NotificationPanel from "./NotificationPanel";

function AppHeader({
  title,
  currency,
  onCurrencyChange,
  onOpenMenu,
  onRecordSale,
  role,
  profile,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <header className="topbar">
      <button
        className="icon-button menu-button"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>
      <div>
        <p className="eyebrow">Tuesday, 18 June 2024</p>
        <h1>{title}</h1>
      </div>
      <div className="top-actions">
        <button className="currency-toggle" onClick={onCurrencyChange}>
          <span className="currency-dot">$</span>
          {currency}
          <ChevronDown size={14} />
        </button>
        <div className="notification-wrap">
          <button
            className="icon-button notification"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-expanded={notificationsOpen}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <i />
          </button>
          {notificationsOpen && (
            <NotificationPanel
              role={role}
              currency={currency}
              profile={profile}
              onClose={() => setNotificationsOpen(false)}
            />
          )}
        </div>
        {role !== "customer" && (
          <button className="primary-button" onClick={onRecordSale}>
            <Plus size={17} /> Record sale
          </button>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
