import {
  CircleDollarSign,
  CreditCard,
  ShoppingCart,
  Users,
  Wallet,
  Boxes,
  ReceiptText,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DebtWatchlist from "../components/DebtWatchlist";
import Metric from "../components/Metric";
import QuickAction from "../components/QuickAction";
import SalesChart from "../components/SalesChart";
import { formatCurrency } from "../data/currency";

function Dashboard({ currency }) {
  const navigate = useNavigate();
  const interactions = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("vanzwe-product-interactions") || "[]",
      );
    } catch {
      return [];
    }
  })();
  const views = interactions.filter((item) => item.type === "view").length;
  const enquiries = interactions.filter(
    (item) => item.type === "contact",
  ).length;
  return (
    <div className="dashboard">
      <section className="welcome-row">
        <div>
          <h2>Your business at a glance</h2>
          <p>Here’s what’s happening with your shop today.</p>
        </div>
        <button
          className="outline-button"
          onClick={() => navigate("/analytics")}
        >
          <ReceiptText size={16} /> View daily summary
        </button>
      </section>
      <section className="metric-grid">
        <Metric
          label="Total sales"
          value={formatCurrency(4280.5, currency)}
          change="+12.8%"
          note="vs. last week"
          icon={Wallet}
          tone="peach"
        />
        <Metric
          label="Money owed to you"
          value={formatCurrency(2145, currency)}
          change="8 people"
          note="need your attention"
          icon={Users}
          tone="lilac"
        />
        <Metric
          label="Estimated profit"
          value={formatCurrency(1682.4, currency)}
          change="+8.4%"
          note="this month"
          icon={CircleDollarSign}
          tone="mint"
        />
        <Metric
          label="Product interest"
          value={interactions.length}
          change={`${enquiries} enquiries`}
          note={`${views} product views`}
          icon={Eye}
          tone="amber"
        />
      </section>
      <div className="content-grid">
        <SalesChart currency={currency} />
        <DebtWatchlist />
      </div>
      <section className="quick-section">
        <div className="section-title">
          <div>
            <h3>Quick actions</h3>
            <p>Common tasks, right at your fingertips.</p>
          </div>
        </div>
        <div className="quick-grid">
          <QuickAction
            icon={ShoppingCart}
            title="Record a sale"
            text="Log a cash or credit sale"
            to="/sales"
          />
          <QuickAction
            icon={CreditCard}
            title="Add credit sale"
            text="Keep your ledger up to date"
            to="/debts"
          />
          <QuickAction
            icon={Boxes}
            title="Update stock"
            text="Check what needs restocking"
            to="/inventory"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
