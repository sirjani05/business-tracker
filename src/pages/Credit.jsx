import { useState } from "react";
import CreditForm from "../components/CreditForm";
import CreditList from "../components/CreditList";

function Credit() {
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
    const entry = { id: Date.now(), ...form, amount: Number(form.amount) };
    const nextEntries = [entry, ...entries].slice(0, 30);
    setEntries(nextEntries);
    localStorage.setItem("vanzwe-credit", JSON.stringify(nextEntries));
    setForm({ customer: "", description: "", amount: "", dueDate: "" });
    setSaved(true);
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
          form={form}
          saved={saved}
          onChange={updateField}
          onSubmit={saveEntry}
        />
        <CreditList entries={entries} />
      </div>
    </div>
  );
}

export default Credit;
