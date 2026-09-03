import { useState } from "react";
import {
  ArrowUpRight,
  Search,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import ProductBrowser from "../components/ProductBrowser";

function readRecords(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function CustomerDashboard({ currency, profile }) {
  const [products] = useState(() =>
    readRecords("vanzwe-inventory").filter((item) => Number(item.quantity) > 0),
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const categories = [
    "All products",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];
  const visibleProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.supplier || ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesCategory =
      category === "All products" || product.category === category;
    return matchesQuery && matchesCategory;
  });
  function handleInteraction(product, type) {
    const interactions = readRecords("vanzwe-product-interactions");
    interactions.push({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      type,
      customer: profile.ownerName,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(
      "vanzwe-product-interactions",
      JSON.stringify(interactions),
    );
    if (type === "contact")
      window.open(
        `https://wa.me/263718009932?text=${encodeURIComponent(`Hi, I am interested in ${product.name}.`)}`,
        "_blank",
        "noopener,noreferrer",
      );
  }
  return (
    <div className="customer-dashboard">
      <section className="customer-welcome">
        <div>
          <p className="eyebrow">CUSTOMER MARKETPLACE</p>
          <h2>Find something useful, {profile.ownerName}</h2>
          <p>
            Browse products and services currently available from trusted local
            providers.
          </p>
        </div>
        <label className="customer-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or suppliers"
            aria-label="Search products or suppliers"
          />
        </label>
      </section>
      <div className="customer-filters" aria-label="Product filters">
        <SlidersHorizontal size={15} />
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item ? "period-button active" : "period-button"
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <ProductBrowser
        products={visibleProducts}
        provider={readRecords("vanzwe-provider-profile", {
          ownerName: "Tendai's Market",
          businessName: "Tendai's Market",
          location: "Harare, Zimbabwe",
        })}
        currency={currency}
        onInteraction={handleInteraction}
      />
      {products.length > 0 && visibleProducts.length === 0 && (
        <p className="customer-filter-empty">No products match your search.</p>
      )}
      <section className="customer-tip">
        <ShoppingBag size={18} />
        <div>
          <strong>Looking for something specific?</strong>
          <p>Ask the provider directly and mention the product name.</p>
        </div>
        <ArrowUpRight size={16} />
      </section>
    </div>
  );
}

export default CustomerDashboard;
