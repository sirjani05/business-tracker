import { Bell, Check, CircleAlert, Eye, PackageCheck, X } from "lucide-react";
import { formatCurrency } from "../data/currency";
import { getCreditBalance, getOverdueWeeks } from "../data/credit";

function NotificationPanel({ onClose, role, currency, profile }) {
  const isCustomer = role === "customer";
  let interactionCount;
  try {
    interactionCount = JSON.parse(
      localStorage.getItem("vanzwe-product-interactions") || "[]",
    ).length;
  } catch {
    interactionCount = 0;
  }
  const products = (() => {
    try {
      return JSON.parse(localStorage.getItem("vanzwe-inventory") || "[]")
        .filter((product) => Number(product.quantity) > 0)
        .slice(0, 3);
    } catch {
      return [];
    }
  })();
  const customerCredits = (() => {
    if (!isCustomer) return [];
    const names = new Set(
      [profile?.ownerName, profile?.username]
        .filter(Boolean)
        .map((name) => name.trim().toLowerCase()),
    );
    try {
      return JSON.parse(localStorage.getItem("vanzwe-credit") || "[]").filter(
        (entry) => names.has(entry.customer?.trim().toLowerCase()),
      );
    } catch {
      return [];
    }
  })();
  return (
    <div
      className="notification-panel"
      role="dialog"
      aria-label="Notifications"
    >
      <div className="notification-heading">
        <div>
          <strong>Notifications</strong>
          <small>
            {isCustomer
              ? "Fresh products from local providers"
              : "Recent updates from your business"}
          </small>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>
      {!isCustomer && (
        <div className="notification-item">
          <span className="notification-item-icon views">
            <Eye size={16} />
          </span>
          <div>
            <strong>{interactionCount} product interactions</strong>
            <small>Customers have viewed or asked about your products.</small>
          </div>
        </div>
      )}
      {!isCustomer && (
        <div className="notification-item">
          <span className="notification-item-icon warning">
            <CircleAlert size={16} />
          </span>
          <div>
            <strong>Credit follow-up needed</strong>
            <small>Tariro Moyo is 3 days overdue.</small>
          </div>
        </div>
      )}
      {!isCustomer && (
        <div className="notification-item">
          <span className="notification-item-icon stock">
            <PackageCheck size={16} />
          </span>
          <div>
            <strong>Stock is running low</strong>
            <small>Review your inventory thresholds.</small>
          </div>
        </div>
      )}

      {isCustomer && (
        <>
          {customerCredits.length > 0 ? (
            customerCredits.map((entry) => {
              const overdueWeeks = getOverdueWeeks(entry);
              const balance = getCreditBalance(entry);
              return (
                <div className="notification-item" key={entry.id}>
                  <span
                    className={`notification-item-icon ${overdueWeeks ? "warning" : "done"}`}
                  >
                    {overdueWeeks ? (
                      <CircleAlert size={16} />
                    ) : (
                      <Check size={16} />
                    )}
                  </span>
                  <div>
                    <strong>
                      {overdueWeeks
                        ? "Credit payment overdue"
                        : "Credit payment reminder"}
                    </strong>
                    <small>
                      {formatCurrency(balance, currency)} due {entry.dueDate}.
                      {overdueWeeks
                        ? ` Payment is ${overdueWeeks} week${overdueWeeks === 1 ? "" : "s"} late; 10% is added after each completed week.`
                        : " Please pay by the due date to avoid the 10% weekly late fee."}
                    </small>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="notification-item">
              <span className="notification-item-icon done">
                <Check size={16} />
              </span>
              <div>
                <strong>No outstanding credit</strong>
                <small>Your credit payments are up to date.</small>
              </div>
            </div>
          )}
          <div className="notification-item">
            <span className="notification-item-icon done">
              <Check size={16} />
            </span>
            <div>
              <strong>Browse local products</strong>
              <small>Tap Ask provider to start a conversation.</small>
            </div>
          </div>
          {products.length > 0 ? (
            products.map((product) => (
              <div className="notification-item" key={product.id}>
                <span className="notification-item-icon stock">
                  <PackageCheck size={16} />
                </span>
                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {formatCurrency(product.price || 0, currency)} ·{" "}
                    {product.quantity} available
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="notification-item">
              <span className="notification-item-icon stock">
                <PackageCheck size={16} />
              </span>
              <div>
                <strong>No products listed yet</strong>
                <small>Check back when the provider adds stock.</small>
              </div>
            </div>
          )}
        </>
      )}
      <div className="notification-item">
        <span className="notification-item-icon done">
          <Check size={16} />
        </span>
        <div>
          <strong>Everything is synced</strong>
          <small>Your records are saved on this device.</small>
        </div>
      </div>
      <div className="notification-footer">
        <Bell size={13} /> You are all caught up
      </div>
    </div>
  );
}

export default NotificationPanel;
