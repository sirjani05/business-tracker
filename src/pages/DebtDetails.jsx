import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { formatCurrency } from "../data/currency";

function DebtDetails({ currency = "USD" }) {
  const { id } = useParams();
  const entries = JSON.parse(localStorage.getItem("vanzwe-credit") || "[]");
  const entry = entries.find((item) => String(item.id) === id) || entries[0];
  if (!entry)
    return (
      <div className="empty-page">
        <div className="empty-icon">
          <CreditCard size={24} />
        </div>
        <h2>Debt not found</h2>
        <p>Add a credit entry to start the customer ledger.</p>
        <Link className="primary-button" to="/debts">
          Back to debts
        </Link>
      </div>
    );
  return (
    <div className="detail-page">
      <Link className="back-link" to="/debts">
        <ArrowLeft size={15} /> Back to debts
      </Link>
      <section className="detail-hero">
        <div className="person-avatar coral">
          {entry.customer
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <h2>{entry.customer}</h2>
          <p>{entry.description || "Credit sale"}</p>
        </div>
        <strong>{formatCurrency(entry.amount, currency)}</strong>
      </section>
      <div className="detail-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Debt summary</h3>
              <p>Current balance and repayment timeline.</p>
            </div>
            <CircleDollarSign className="panel-icon" size={20} />
          </div>
          <div className="detail-facts">
            <span>
              <CalendarDays size={15} /> Due {entry.dueDate}
            </span>
            <span>
              <CreditCard size={15} /> Open balance
            </span>
          </div>
          <a
            className="primary-button"
            href={`https://wa.me/263718009932?text=${encodeURIComponent(`Hi ${entry.customer}, this is a friendly reminder about your outstanding balance.`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Send WhatsApp reminder
          </a>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Payment history</h3>
              <p>Payments will appear here as they are recorded.</p>
            </div>
          </div>
          <div className="sales-empty">
            <CircleDollarSign size={20} />
            <span>No payments recorded.</span>
            <small>Use the credit page to keep this ledger updated.</small>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DebtDetails;
