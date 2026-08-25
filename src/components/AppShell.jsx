import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import Dashboard from "../pages/Dashboard";
import Sales from "../pages/Sales";
import Credit from "../pages/Credit";
import Inventory from "../pages/Inventory";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import { defaultProfile } from "../data/profile";
import SectionPage from "./SectionPage";

function AppShell() {
  const [currency, setCurrency] = useState("USD");
  const [profile, setProfile] = useState(() => ({
    ...defaultProfile,
    ...JSON.parse(localStorage.getItem("vanzwe-profile") || "{}"),
  }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = {
    "/": "Good morning, Tendai",
    "/sales": "Sales",
    "/credit": "Chikwereti",
    "/inventory": "Inventory",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };
  const pageTitle = titles[location.pathname] || "Vamwe Biz OS";
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
          onRecordSale={() => navigate("/sales")}
        />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard currency={currency} />} />
            <Route path="/sales" element={<Sales currency={currency} />} />
            <Route path="/credit" element={<Credit />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route
              path="/analytics"
              element={<Analytics currency={currency} />}
            />
            <Route
              path="/settings"
              element={<Settings profile={profile} onSave={saveProfile} />}
            />
            <Route path="*" element={<SectionPage title={pageTitle} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AppShell;
