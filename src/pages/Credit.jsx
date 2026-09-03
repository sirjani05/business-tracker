import { useState } from "react";
import CreditForm from "../components/CreditForm";
import CreditList from "../components/CreditList";
import { ZIG_PER_USD } from "../data/currency";

function Credit({ currency }) {
  const [entries, setEntries] = useState(() =>
    JSON.parse(localStorage.getItem("vanzwe-credit") || "[]"),
  );
  const [form, setForm] = useState({
    customer: "",
    description: "",
    amount: "",
    dueDate: "",
  });
  const [saved, setSaved] = useState(false);
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSaved(false);
  }
  function saveEntry(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    const entry = {
      id: Date.now(),
      ...form,
      amount: currency === "ZiG" ? amount / ZIG_PER_USD : amount,
      originalAmount: currency === "ZiG" ? amount / ZIG_PER_USD : amount,
      currency: "USD",
    };
    const nextEntries = [entry, ...entries].slice(0, 30);
    setEntries(nextEntries);
    localStorage.setItem("vanzwe-credit", JSON.stringify(nextEntries));
    window.dispatchEvent(new Event("vanzwe-credit-updated"));
    setForm({ customer: "", description: "", amount: "", dueDate: "" });
    setSaved(true);
  }
  function markPaid(entryId) {
    const nextEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(nextEntries);
    localStorage.setItem("vanzwe-credit", JSON.stringify(nextEntries));
    window.dispatchEvent(new Event("vanzwe-credit-updated"));
  }
  return (
    <div className="entry-page">
      <section className="welcome-row">
        <div>
          <h2>Chikwereti</h2>
          <p>Record credit today and collect with confidence.</p>
        </div>
        <div className="sales-balance">
          <span>Open accounts</span>
          <strong>{entries.length}</strong>
        </div>
      </section>
      <div className="sales-layout">
        <CreditForm
          currency={currency}
          form={form}
          saved={saved}
          onChange={updateField}
          onSubmit={saveEntry}
        />
        <CreditList entries={entries} currency={currency} onPaid={markPaid} />
      </div>
    </div>
  );
}

export default Credit;
