import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { productService } from '../services/productService';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    productService.getProducts()
      .then((products) => {
        if (active) setFeaturedProducts(products.slice(0, 4));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-5 container">
      <div className="text-center mb-5">
          <h2 className="fw-semibold m-0 mb-2">Trending Jewellery</h2>
          <p className="text-muted mb-0 small">
            Discover standout pieces from our collection.
          </p>
      </div>

      {error && <p className="alert alert-danger" role="alert">Could not load products: {error}</p>}
      {loading && <p className="text-center text-muted" role="status">Loading jewellery…</p>}
      {!loading && !error && featuredProducts.length === 0 && (
        <p className="text-center text-muted" role="status">No products are available right now.</p>
      )}
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
