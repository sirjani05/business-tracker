import { ArrowDown, Boxes } from "lucide-react";

function InventoryList({ items }) {
  return (
    <section className="panel recent-sales">
      <div className="panel-heading">
        <div>
          <h3>Stock on hand</h3>
          <p>Items that need your attention first.</p>
        </div>
        <Boxes size={20} className="panel-icon" />
      </div>
      {items.length === 0 ? (
        <div className="sales-empty">
          <Boxes size={20} />
          <span>No stock items recorded yet.</span>
          <small>Your inventory will appear here.</small>
        </div>
      ) : (
        <div className="sales-list">
          {items.map((item) => {
            const low = item.quantity <= item.threshold;
            return (
              <div className="sale-row" key={item.id}>
                <div className={`stock-status ${low ? "low" : "healthy"}`}>
                  <Boxes size={16} />
                </div>
                <div className="sale-details">
                  <strong>{item.name}</strong>
                  <small>
                    {item.supplier || "No supplier tagged"} · Reorder at{" "}
                    {item.threshold}
                  </small>
                </div>
                <div className="stock-count">
                  <strong>{item.quantity}</strong>
                  <small>
                    {low ? (
                      <>
                        <ArrowDown size={11} /> Low stock
                      </>
                    ) : (
                      "in stock"
                    )}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default InventoryList;
