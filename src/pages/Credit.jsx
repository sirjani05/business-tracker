import { useEffect, useState } from "react";
import CreditForm from "../components/CreditForm";
import CreditList from "../components/CreditList";

function Credit({ currency }) {
  const [entries, setEntries] = useState(() =>
    JSON.parse(localStorage.getItem("vanzwe-credit") || "[]"),
  );
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    description: "",
    amount: "",
    dueDate: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    fetch("/api/credits")
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((remoteEntries) => {
        setEntries(remoteEntries);
        localStorage.setItem("vanzwe-credit", JSON.stringify(remoteEntries));
      })
      .catch(() =>
        setApiError("Backend unavailable. Entries are saved on this device."),
      )
      .finally(() => setLoading(false));
  }, []);
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSaved(false);
  }
  async function saveEntry(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    const entry = {
      id: Date.now(),
      ...form,
      amount,
      currency,
    };
    try {
      const response = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error("Could not save credit");
      const savedEntry = await response.json();
      const nextEntries = [
        savedEntry,
        ...entries.filter((item) => item.id !== savedEntry.id),
      ].slice(0, 30);
      setEntries(nextEntries);
      localStorage.setItem("vanzwe-credit", JSON.stringify(nextEntries));
      setApiError("");
      window.dispatchEvent(new Event("vanzwe-credit-updated"));
      setForm({
        customer: "",
        phone: "",
        description: "",
        amount: "",
        dueDate: "",
      });
      setSaved(true);
    } catch {
      setApiError(
        "Could not reach the backend. Start it with npm run dev:server.",
      );
    }
  }
  async function markPaid(entryId) {
    await fetch(`/api/credits/${entryId}`, { method: "DELETE" });
    const nextEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(nextEntries);
    localStorage.setItem("vanzwe-credit", JSON.stringify(nextEntries));
    window.dispatchEvent(new Event("vanzwe-credit-updated"));
  }
  async function remindCustomer(entry) {
    const response = await fetch(`/api/reminders/${entry.id}`, {
      method: "POST",
    });
    if (!response.ok) return setApiError("Could not create the reminder.");
    const reminder = await response.json();
    if (reminder.whatsappUrl)
      window.open(reminder.whatsappUrl, "_blank", "noopener,noreferrer");
    else setApiError("Add a WhatsApp number to open a reminder chat.");
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
      {apiError && (
        <p className="success-message" role="status">
          {apiError}
        </p>
      )}
      <div className="sales-layout">
        <CreditForm
          currency={currency}
          form={form}
          saved={saved}
          onChange={updateField}
          onSubmit={saveEntry}
        />
        <CreditList
          entries={loading ? [] : entries}
          currency={currency}
          onPaid={markPaid}
          onRemind={remindCustomer}
        />
      </div>
    </div>
  );
}

export default Credit;
