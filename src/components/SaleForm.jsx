import { Plus, ShoppingCart } from "lucide-react";

function SaleForm({ currency, form, saved, onChange, onSubmit }) {
  const symbol = currency === "USD" ? "$" : "ZiG ";
  return (
    <form className="panel sale-form" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <h3>New sale</h3>
          <p>Choose how the customer paid.</p>
        </div>
        <ShoppingCart size={20} className="panel-icon" />
      </div>
      <label>
        Product or service
        <input
          name="product"
          value={form.product}
          onChange={onChange}
          placeholder="e.g. 2kg mealie meal"
          required
        />
      </label>
      <div className="form-row">
        <label>
          Quantity
          <input
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={form.quantity}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Unit price ({currency})
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={onChange}
            placeholder="0.00"
            required
          />
        </label>
      </div>
      <label>
        Customer name <span className="optional">optional</span>
        <input
          name="customer"
          value={form.customer}
          onChange={onChange}
          placeholder="Walk-in customer"
        />
      </label>
      <fieldset>
        <legend>Sales method</legend>
        <div className="method-grid">
          {["Cash", "EcoCash", "Card", "Credit"].map((method) => (
            <label
              className={`method-option ${form.method === method ? "selected" : ""}`}
              key={method}
            >
              <input
                type="radio"
                name="method"
                value={method}
                checked={form.method === method}
                onChange={onChange}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sale-total">
        <span>Total</span>
        <strong>
          {symbol}
          {((Number(form.quantity) || 0) * (Number(form.price) || 0)).toFixed(
            2,
          )}
        </strong>
      </div>
      <button className="primary-button save-sale" type="submit">
        <Plus size={17} /> Save sale
      </button>
      {saved && (
        <p className="success-message" role="status">
          Sale saved on this device.
        </p>
      )}
    </form>
  );
}

export default SaleForm;
