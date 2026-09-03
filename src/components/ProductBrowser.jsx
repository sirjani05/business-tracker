import { Eye, MapPin, MessageCircle, PackageOpen, X } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../data/currency";

function ProductBrowser({ products, provider, currency, onInteraction }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const providerActive = provider.isActive !== false;
  return (
    <section className="customer-products">
      <div className="customer-provider">
        <div className="workspace-avatar">
          {provider.profileImage ? (
            <img src={provider.profileImage} alt="" />
          ) : (
            provider.ownerName.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <small>PROVIDED BY</small>
          <strong>{provider.businessName}</strong>
          <span>
            <MapPin size={12} /> {provider.location} ·
            <b
              className={
                providerActive ? "provider-status active" : "provider-status"
              }
            >
              {providerActive ? " Active" : " Offline"}
            </b>
          </span>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="customer-empty">
          <PackageOpen size={26} />
          <h3>No products available right now</h3>
          <p>This provider has not listed any in-stock products yet.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <PackageOpen size={25} />
                )}
              </div>
              <div className="product-card-body">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.supplier || "Available from this provider"}</p>
                </div>
                <strong>{formatCurrency(product.price || 0, currency)}</strong>
                <small>{product.quantity} available</small>
                <div className="product-actions">
                  <button
                    onClick={() => {
                      onInteraction(product, "view");
                      setSelectedProduct(product);
                    }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="product-contact"
                    onClick={() => onInteraction(product, "contact")}
                  >
                    <MessageCircle size={14} /> Ask provider
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div
          className="product-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProduct.name} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="icon-button product-modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              <X size={17} />
            </button>
            <div className="product-modal-image">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              ) : (
                <PackageOpen size={32} />
              )}
            </div>
            <p className="eyebrow">PRODUCT DETAILS</p>
            <h3>{selectedProduct.name}</h3>
            <strong>
              {formatCurrency(selectedProduct.price || 0, currency)}
            </strong>
            <p>{selectedProduct.quantity} available in stock</p>
            <p>Category: {selectedProduct.category || "Uncategorised"}</p>
            <p>
              Owned by <b>{provider.businessName}</b> ({provider.ownerName})
            </p>
            <p
              className={
                providerActive ? "provider-status active" : "provider-status"
              }
            >
              {providerActive ? "Provider is active" : "Provider is offline"}
            </p>
          </section>
        </div>
      )}
    </section>
  );
}

export default ProductBrowser;
