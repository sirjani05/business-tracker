import { CreditCard, Plus } from "lucide-react";

function CreditForm({ form, saved, onChange, onSubmit }) {
  return (
    <form className="panel entry-form" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <h3>Add credit entry</h3>
          <p>Keep every customer promise visible.</p>
        </div>
        <CreditCard size={20} className="panel-icon" />
      </div>
      <label>
        Customer name
        <input
          name="customer"
          value={form.customer}
          onChange={onChange}
          placeholder="e.g. Tariro Moyo"
          required
        />
      </label>
      <label>
        What did they take? <span className="optional">optional</span>
        <input
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="e.g. Groceries"
        />
      </label>
      <div className="form-row">
        <label>
          Amount owed (USD)
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={onChange}
            placeholder="0.00"
            required
          />
        </label>
        <label>
          Due date
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={onChange}
            required
          />
        </label>
      </div>
      <button className="primary-button save-sale" type="submit">
        <Plus size={17} /> Save credit entry
      </button>
      {saved && (
        <p className="success-message" role="status">
          Credit entry saved on this device.
        </p>
      )}
    </form>
  );
}

export default CreditForm;
