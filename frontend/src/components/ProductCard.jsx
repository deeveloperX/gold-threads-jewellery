export default function ProductCard({ product, onQuickView, onAddToCart }) {
  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow transition">
      <div className="position-relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-img-top object-fit-cover"
          style={{ height: '260px' }}
        />
        <span className="position-absolute top-0 start-0 m-3 badge bg-dark text-warning border border-warning border-opacity-25 px-2 py-1">
          {product.badge}
        </span>
        <button
          onClick={() => onQuickView(product)}
          className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm"
          title="Quick View"
        >
          👁️
        </button>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted text-uppercase tracking-wider fw-bold">
            {product.category}
          </small>
          <small className="text-warning fw-semibold">★ {product.rating}</small>
        </div>

        <h5 className="card-title fw-bold text-dark fs-6 mb-2">{product.name}</h5>

        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="fw-bold fs-5 text-dark">PKR {product.price.toLocaleString()}</span>
          <span className="text-muted text-decoration-line-through small">
            PKR {product.originalPrice.toLocaleString()}
          </span>
        </div>

        <div className="d-flex gap-2 mb-3 small text-success fw-semibold">
          <span>💧 Waterproof</span>
          <span>•</span>
          <span>✨ Non-Tarnish</span>
        </div>

        <div className="mt-auto d-grid gap-2">
          <button 
            className="btn btn-dark btn-sm rounded-pill fw-semibold py-2"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}