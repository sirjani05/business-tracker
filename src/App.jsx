import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useOutletContext,
} from "react-router-dom";
import AppShell from "./components/AppShell";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import VerifyPin from "./pages/VerifyPin";
import Sales from "./pages/Sales";
import Credit from "./pages/Credit";
import DebtDetails from "./pages/DebtDetails";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-pin" element={<VerifyPin />} />
          <Route path="/404" element={<NotFound />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardRoute />} />
            <Route path="/debts" element={<Credit />} />
            <Route path="/debts/:id" element={<DebtDetails />} />
            <Route path="/sales/new" element={<SalesRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<AnalyticsRoute />} />
            <Route
              path="/sales"
              element={<Navigate to="/sales/new" replace />}
            />
            <Route path="/credit" element={<Navigate to="/debts" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function DashboardRoute() {
  const { currency } = useOutletContext();
  return <Dashboard currency={currency} />;
}
function SalesRoute() {
  const { currency } = useOutletContext();
  return <Sales currency={currency} />;
}
function AnalyticsRoute() {
  const { currency } = useOutletContext();
  return <Analytics currency={currency} />;
}
function SettingsRoute() {
  const { profile, saveProfile } = useOutletContext();
  return <Settings profile={profile} onSave={saveProfile} />;
}

export default App;
