import { useState } from "react";
import InventoryForm from "../components/InventoryForm";
import InventoryList from "../components/InventoryList";

function Inventory() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("vanzwe-inventory") || "[]"),
  );
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
    threshold: 5,
    supplier: "",
  });
  const [saved, setSaved] = useState(false);
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSaved(false);
  }
  function saveItem(event) {
    event.preventDefault();
    const item = {
      id: Date.now(),
      ...form,
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
    };
    const nextItems = [item, ...items].slice(0, 30);
    setItems(nextItems);
    localStorage.setItem("vanzwe-inventory", JSON.stringify(nextItems));
    setForm({ name: "", quantity: 0, threshold: 5, supplier: "" });
    setSaved(true);
  }
  return (
    <div className="entry-page">
      <section className="welcome-row">
        <div>
          <h2>Inventory</h2>
          <p>Know what is moving and what needs a restock.</p>
        </div>
        <div className="sales-balance">
          <span>Items tracked</span>
          <strong>{items.length}</strong>
        </div>
      </section>
      <div className="sales-layout">
        <InventoryForm
          form={form}
          saved={saved}
          onChange={updateField}
          onSubmit={saveItem}
        />
        <InventoryList items={items} />
      </div>
    </div>
  );
}

export default Inventory;
