import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function Shop({ onQuickView, onAddToCart }) {
  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Shop All Jewellery</h1>
        <p className="text-muted mb-0">Browse our complete collection.</p>
      </div>
      <div className="row g-4">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
}