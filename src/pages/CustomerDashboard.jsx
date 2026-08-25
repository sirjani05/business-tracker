import { useEffect, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import ProductBrowser from "../components/ProductBrowser";

function readRecords(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function CustomerDashboard({ currency, profile }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(
      readRecords("vanzwe-inventory").filter(
        (item) => Number(item.quantity) > 0,
      ),
    );
  }, []);
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
        <div className="customer-search">
          <Search size={16} />
          <span>Browse available products</span>
        </div>
      </section>
      <ProductBrowser
        products={products}
        provider={readRecords("vanzwe-provider-profile", {
          ownerName: "Tendai's Market",
          businessName: "Tendai's Market",
          location: "Harare, Zimbabwe",
        })}
        currency={currency}
        onInteraction={handleInteraction}
      />
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
