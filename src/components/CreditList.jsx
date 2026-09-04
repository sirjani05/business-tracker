import { ArrowUpRight, Check, CreditCard } from "lucide-react";
import { formatCurrency } from "../data/currency";
import { getCreditBalance, getOverdueWeeks } from "../data/credit";

function CreditList({ entries, currency, onPaid, onRemind }) {
  return (
    <section className="panel recent-sales">
      <div className="panel-heading">
        <div>
          <h3>Open ledger</h3>
          <p>Customers with an outstanding balance.</p>
        </div>
        <CreditCard size={20} className="panel-icon" />
      </div>
      {entries.length === 0 ? (
        <div className="sales-empty">
          <CreditCard size={20} />
          <span>No credit entries recorded yet.</span>
          <small>Customer balances will appear here.</small>
        </div>
      ) : (
        <div className="sales-list">
          {entries.map((entry) => (
            <div className="sale-row" key={entry.id}>
              <div className="person-avatar coral">
                {entry.customer
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="sale-details">
                <strong>{entry.customer}</strong>
                <small>
                  {entry.description || "Credit sale"} · Due {entry.dueDate}
                </small>
              </div>
              <div className="debt-amount">
                <strong>
                  {formatCurrency(
                    getCreditBalance({
                      ...entry,
                      amount:
                        entry.amountUsd ?? entry.originalAmount ?? entry.amount,
                      originalAmount:
                        entry.amountUsd ?? entry.originalAmount ?? entry.amount,
                    }),
                    currency,
                  )}
                </strong>
                {getOverdueWeeks(entry) > 0 && (
                  <small className="overdue-note">
                    +10% · week {getOverdueWeeks(entry)}
                  </small>
                )}
                <button
                  className="remind-button"
                  aria-label={`Remind ${entry.customer}`}
                  onClick={() => onRemind(entry)}
                  title="Send WhatsApp reminder"
                >
                  <ArrowUpRight size={14} />
                </button>
                <button
                  className="paid-button"
                  aria-label={`Mark ${entry.customer} as paid`}
                  onClick={() => onPaid(entry.id)}
                >
                  <Check size={14} /> <span>Mark as paid</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CreditList;
