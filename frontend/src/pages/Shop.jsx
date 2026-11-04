import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Link, useSearchParams } from 'react-router';

const categories = [...new Set(PRODUCTS.map((product) => product.category))].map((name) => ({
  name,
  count: PRODUCTS.filter((product) => product.category === name).length,
}));

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const products = category
    ? PRODUCTS.filter((product) => product.category === category)
    : PRODUCTS;

  return (
    <section className="container py-5">
      <div className="mb-4">
        <p className="luxury-subtitle mb-2">The collection</p>
        <h1 className="fw-normal mb-2">{category || 'Find Your Perfect Piece'}</h1>
      </div>

      <nav className="shop-category-nav mb-4 mb-lg-5" aria-label="Filter products by category">
        <Link
          to="/shop"
          className={`shop-category-link ${!category ? 'active' : ''}`}
          aria-current={!category ? 'page' : undefined}
        >
          All pieces <span>{PRODUCTS.length}</span>
        </Link>
        {categories.map(({ name, count }) => (
          <Link
            key={name}
            to={`/shop?category=${encodeURIComponent(name)}`}
            className={`shop-category-link ${category === name ? 'active' : ''}`}
            aria-current={category === name ? 'page' : undefined}
          >
            {name} <span>{count}</span>
          </Link>
        ))}
      </nav>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard
              product={product}
            />
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-12 py-5 text-center">
            <h2 className="h4">No pieces found in this collection</h2>
            <p className="text-muted">Choose another category to explore our jewellery.</p>
            <Link to="/shop" className="btn btn-outline-gold rounded-pill px-4">
              View all pieces
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}