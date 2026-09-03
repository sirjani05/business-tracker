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
    price: "",
    category: "",
    image: "",
  });
  const [saved, setSaved] = useState(false);
  function updateField(event) {
    if (event.target.name === "image") {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
    setSaved(false);
  }
  function saveItem(event) {
    event.preventDefault();
    const item = {
      id: Date.now(),
      ...form,
      quantity: Number(form.quantity),
      threshold: Number(form.threshold),
      price: Number(form.price || 0),
    };
    const nextItems = [item, ...items].slice(0, 30);
    setItems(nextItems);
    localStorage.setItem("vanzwe-inventory", JSON.stringify(nextItems));
    setForm({
      name: "",
      quantity: 0,
      threshold: 5,
      supplier: "",
      price: "",
      category: "",
      image: "",
    });
    setSaved(true);
  }
  function deleteItem(itemId) {
    const nextItems = items.filter((item) => item.id !== itemId);
    setItems(nextItems);
    localStorage.setItem("vanzwe-inventory", JSON.stringify(nextItems));
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
        <InventoryList items={items} onDelete={deleteItem} />
      </div>
    </div>
  );
}

export default Inventory;
