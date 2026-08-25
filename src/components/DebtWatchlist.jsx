import { ArrowUpRight, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

const debts = [
  {
    initials: "TM",
    name: "Tariro Moyo",
    detail: "Due today · 3 days overdue",
    amount: "$185.00",
    tone: "coral",
  },
  {
    initials: "CN",
    name: "Chipo Ncube",
    detail: "Due in 2 days",
    amount: "$72.50",
    tone: "mint",
  },
  {
    initials: "PM",
    name: "Peter Mutasa",
    detail: "Due in 5 days",
    amount: "$240.00",
    tone: "amber",
  },
];

function DebtWatchlist() {
  function openReminder(name) {
    window.open(
      `https://wa.me/263718009932?text=${encodeURIComponent(`Hi ${name}, this is a friendly reminder about your outstanding balance at Tendai's Market.`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  return (
    <section className="panel debt-panel">
      <div className="panel-heading">
        <div>
          <h3>Debt watchlist</h3>
          <p>Customers who need a nudge</p>
        </div>
        <NavLink to="/debts" className="text-link">
          View all <ArrowUpRight size={14} />
        </NavLink>
      </div>
      <div className="debt-list">
        {debts.map((debt) => (
          <div className="debt-row" key={debt.name}>
            <div className={`person-avatar ${debt.tone}`}>{debt.initials}</div>
            <div className="debt-person">
              <strong>{debt.name}</strong>
              <small>{debt.detail}</small>
            </div>
            <div className="debt-amount">
              <strong>{debt.amount}</strong>
              <button
                onClick={() => openReminder(debt.name)}
                aria-label={`Remind ${debt.name}`}
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="soft-button" onClick={() => openReminder("there")}>
        <Search size={15} /> Send reminders
      </button>
    </section>
  );
}

export default DebtWatchlist;
