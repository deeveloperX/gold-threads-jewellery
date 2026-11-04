import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card border-0 text-center h-100 d-flex flex-column align-items-center p-3 p-md-0 transition text-decoration-none"
      style={{ backgroundColor: '#FBF9F6', borderRadius: '0px' }}
    >
      <div className="product-image-container position-relative w-100 mb-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '310px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid object-fit-cover h-100 w-100 product-img-hover"
        />
        <span className="product-card-overlay">
          <span className="product-card-cta d-inline-flex align-items-center gap-2">
            VIEW DETAILS
            <FiArrowRight size={14} aria-hidden="true" />
          </span>
        </span>
      </div>

      <h3
        className="product-title text-uppercase mb-2">
        {product.name}
      </h3>
    </Link>
  );
}