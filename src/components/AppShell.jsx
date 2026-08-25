import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { defaultProfile } from "../data/profile";

function AppShell() {
  const [profile, setProfile] = useState(() => ({
    ...defaultProfile,
    ...JSON.parse(localStorage.getItem("vanzwe-profile") || "{}"),
  }));
  const [currency, setCurrency] = useState(profile.currency || "USD");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = {
    "/": `Welcome ${profile.ownerName} to Vamwe Biz OS`,
    "/sales/new": "Sales",
    "/debts": "Chikwereti",
    "/debts/:id": "Debt details",
    "/inventory": "Inventory",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  const pageTitle = location.pathname.startsWith("/debts/")
    ? "Debt details"
    : titles[location.pathname] || "Vamwe Biz OS";
  function saveProfile(nextProfile) {
    setProfile(nextProfile);
    setCurrency(nextProfile.currency);
    localStorage.setItem("vanzwe-profile", JSON.stringify(nextProfile));
  }
  return (
    <div className="app-shell">
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        profile={profile}
      />
      <main className="main-content">
        <AppHeader
          title={pageTitle}
          currency={currency}
          onCurrencyChange={() =>
            setCurrency(currency === "USD" ? "ZiG" : "USD")
          }
          onOpenMenu={() => setMobileOpen(true)}
          onRecordSale={() => navigate("/sales/new")}
        />
        <div className="page-content">
          <Outlet context={{ currency, profile, saveProfile }} />
        </div>
      </main>
    </div>
  );
}

export default AppShell;
