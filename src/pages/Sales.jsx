import { useState } from "react";
import SaleForm from "../components/SaleForm";
import RecentSales from "../components/RecentSales";

function Sales({ currency }) {
  const [sales, setSales] = useState(() =>
    JSON.parse(localStorage.getItem("vanzwe-sales") || "[]"),
  );
  const [form, setForm] = useState({
    product: "",
    quantity: 1,
    price: "",
    customer: "",
    method: "Cash",
  });
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSaved(false);
  }

  function saveSale(event) {
    event.preventDefault();
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    if (!form.product.trim() || quantity < 1 || price <= 0) return;
    const sale = {
      id: Date.now(),
      ...form,
      quantity,
      price,
      total: quantity * price,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    const nextSales = [sale, ...sales].slice(0, 12);
    setSales(nextSales);
    localStorage.setItem("vanzwe-sales", JSON.stringify(nextSales));
    setForm({
      product: "",
      quantity: 1,
      price: "",
      customer: "",
      method: "Cash",
    });
    setSaved(true);
  }

  return (
    <div className="sales-page">
      <section className="welcome-row">
        <div>
          <h2>Record a sale</h2>
          <p>Capture every sale while the details are fresh.</p>
        </div>
        <div className="sales-balance">
          <span>Today's entries</span>
          <strong>{sales.length}</strong>
        </div>
      </section>
      <div className="sales-layout">
        <SaleForm
          currency={currency}
          form={form}
          saved={saved}
          onChange={updateField}
          onSubmit={saveSale}
        />
        <RecentSales sales={sales} currency={currency} />
      </div>
    </div>
  );
}

export default Sales;
