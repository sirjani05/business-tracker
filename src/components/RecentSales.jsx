import { ReceiptText, ShoppingCart } from "lucide-react";

function RecentSales({ sales, currency }) {
  const symbol = currency === "USD" ? "$" : "ZiG ";
  return (
    <section className="panel recent-sales">
      <div className="panel-heading">
        <div>
          <h3>Recent sales</h3>
          <p>Your latest entries on this device.</p>
        </div>
        <ReceiptText size={20} className="panel-icon" />
      </div>
      {sales.length === 0 ? (
        <div className="sales-empty">
          <ShoppingCart size={20} />
          <span>No sales recorded yet.</span>
          <small>Your saved sales will appear here.</small>
        </div>
      ) : (
        <div className="sales-list">
          {sales.map((sale) => (
            <div className="sale-row" key={sale.id}>
              <div className="sale-row-icon">
                <ReceiptText size={16} />
              </div>
              <div className="sale-details">
                <strong>{sale.product}</strong>
                <small>
                  {sale.customer || "Walk-in customer"} · {sale.method} ·{" "}
                  {sale.createdAt}
                </small>
              </div>
              <strong>
                {symbol}
                {sale.total.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentSales;
