export default function ProductQuickView({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div
      className="position-fixed top-0 end-0 bottom-0 start-0 z-3 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 p-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="bg-white rounded-4 shadow-lg p-4 w-100"
        style={{ maxWidth: '720px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={onClose} aria-label="Close product details" />
        </div>
        <div className="row g-4 align-items-center">
          <div className="col-md-5">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-3 w-100 object-fit-cover"
              style={{ maxHeight: '360px' }}
            />
          </div>
          <div className="col-md-7">
            <p className="text-muted text-uppercase small fw-bold mb-2">{product.category}</p>
            <h2 className="h4 fw-bold" id="quick-view-title">{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <p className="fs-5 fw-bold mb-4">PKR {product.price.toLocaleString()}</p>
            <button className="btn btn-dark rounded-pill px-4" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}