import { Boxes, Plus } from "lucide-react";

function InventoryForm({ form, saved, onChange, onSubmit }) {
  return (
    <form className="panel entry-form" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <h3>Add inventory item</h3>
          <p>Track stock before it runs out.</p>
        </div>
        <Boxes size={20} className="panel-icon" />
      </div>
      <label>
        Product name
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g. Cooking oil 2L"
          required
        />
      </label>
      <div className="form-row">
        <label>
          Quantity
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Reorder at
          <input
            name="threshold"
            type="number"
            min="0"
            step="1"
            value={form.threshold}
            onChange={onChange}
            required
          />
        </label>
      </div>
      <label>
        Selling price (USD) <span className="optional">optional</span>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={onChange}
          placeholder="0.00"
        />
      </label>
      <label>
        Supplier <span className="optional">optional</span>
        <input
          name="supplier"
          value={form.supplier}
          onChange={onChange}
          placeholder="e.g. Mbare Wholesale"
        />
      </label>
      <button className="primary-button save-sale" type="submit">
        <Plus size={17} /> Save item
      </button>
      {saved && (
        <p className="success-message" role="status">
          Inventory item saved on this device.
        </p>
      )}
    </form>
  );
}

export default InventoryForm;
