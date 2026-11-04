import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';

export default function FeaturedProducts() {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="py-5 container">
      <div className="text-center mb-5">
          <h2 className="fw-semibold m-0 mb-2">Trending Jewellery</h2>
          <p className="text-muted mb-0 small">
            Discover standout pieces from our collection.
          </p>
      </div>

      <div className="row g-4">
        {featuredProducts.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard
              product={product}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
