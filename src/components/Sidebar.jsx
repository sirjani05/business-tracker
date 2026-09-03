import {
  BarChart3,
  Boxes,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import WorkspaceModal from "./WorkspaceModal";

function getCreditCustomerCount() {
  try {
    return new Set(
      JSON.parse(localStorage.getItem("vanzwe-credit") || "[]")
        .map((entry) => entry.customer?.trim().toLowerCase())
        .filter(Boolean),
    ).size;
  } catch {
    return 0;
  }
}

const navItems = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Sales", to: "/sales/new", icon: ShoppingCart },
  { label: "Chikwereti", to: "/debts", icon: CreditCard },
  { label: "Inventory", to: "/inventory", icon: Boxes },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

function Sidebar({ open, onClose, profile, isCustomer }) {
  const [creditCustomerCount, setCreditCustomerCount] = useState(
    getCreditCustomerCount,
  );
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const initials = profile.ownerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  useEffect(() => {
    const refreshCreditCount = () =>
      setCreditCustomerCount(getCreditCustomerCount());
    window.addEventListener("vanzwe-credit-updated", refreshCreditCount);
    return () =>
      window.removeEventListener("vanzwe-credit-updated", refreshCreditCount);
  }, []);
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">
          <Sparkles size={18} />
        </span>
        <span>
          Vamwe <b>Biz OS</b>
        </span>
        <button
          className="icon-button close-menu"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      <div className="workspace">
        <div className="workspace-avatar">
          {profile.profileImage ? (
            <img src={profile.profileImage} alt="" />
          ) : (
            initials
          )}
        </div>
        <div>
          <strong>{profile.businessName}</strong>
          <small>{profile.location}</small>
        </div>
        <button
          className="workspace-chevron"
          onClick={() => setWorkspaceModalOpen(true)}
          aria-label="Open workspace actions"
          aria-haspopup="dialog"
        >
          <ChevronDown size={15} />
        </button>
      </div>
      <nav>
        <small className="nav-label">WORKSPACE</small>
        {(isCustomer
          ? [{ label: "Browse products", to: "/", icon: ShoppingCart }]
          : navItems
        ).map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <Icon size={19} />
            <span>{label}</span>
            {!isCustomer && to === "/debts" && creditCustomerCount > 0 && (
              <em>{creditCustomerCount}</em>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-link">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
        <div className="user-row-wrap">
          <NavLink to="/settings" className="user-row" onClick={onClose}>
            <div className="avatar">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="" />
              ) : (
                initials
              )}
            </div>
            <div>
              <strong>{profile.ownerName}</strong>
              <small>{isCustomer ? "Customer account" : "Owner account"}</small>
            </div>
          </NavLink>
          <button
            className="account-menu-button"
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            aria-label="Open owner account menu"
            aria-expanded={accountMenuOpen}
          >
            <BsThreeDots className="more-dots" aria-hidden="true" />
          </button>
          {accountMenuOpen && (
            <div className="account-menu" role="menu">
              <NavLink
                to="/settings"
                role="menuitem"
                onClick={() => {
                  setAccountMenuOpen(false);
                  onClose();
                }}
              >
                <Settings size={15} /> Account settings
              </NavLink>
              <a
                href="https://wa.me/263718009932"
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                onClick={() => setAccountMenuOpen(false)}
              >
                <FaWhatsapp size={15} /> Contact support
              </a>
            </div>
          )}
        </div>
      </div>
      {workspaceModalOpen && (
        <WorkspaceModal
          profile={profile}
          onClose={() => setWorkspaceModalOpen(false)}
        />
      )}
    </aside>
  );
}

export default Sidebar;
