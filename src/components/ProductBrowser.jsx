import { Eye, MapPin, MessageCircle, PackageOpen } from "lucide-react";
import { formatCurrency } from "../data/currency";

function ProductBrowser({ products, provider, currency, onInteraction }) {
  return <section className="customer-products"><div className="customer-provider"><div className="workspace-avatar">{provider.profileImage ? <img src={provider.profileImage} alt="" /> : provider.ownerName.slice(0, 2).toUpperCase()}</div><div><small>PROVIDED BY</small><strong>{provider.businessName}</strong><span><MapPin size={12} /> {provider.location}</span></div></div>{products.length === 0 ? <div className="customer-empty"><PackageOpen size={26} /><h3>No products available right now</h3><p>This provider has not listed any in-stock products yet.</p></div> : <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><div className="product-image"><PackageOpen size={25} /></div><div className="product-card-body"><div><h3>{product.name}</h3><p>{product.supplier || "Available from this provider"}</p></div><strong>{formatCurrency(product.price || 0, currency)}</strong><small>{product.quantity} available</small><div className="product-actions"><button onClick={() => onInteraction(product, "view")}><Eye size={14} /> View</button><button className="product-contact" onClick={() => onInteraction(product, "contact")}><MessageCircle size={14} /> Ask provider</button></div></div></article>)}</div>}</section>
}

export default ProductBrowser
