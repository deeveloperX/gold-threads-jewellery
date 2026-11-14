import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Link, useSearchParams } from 'react-router';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([productService.getProducts(), categoryService.getCategories()])
      .then(([activeProducts, activeCategories]) => {
        if (!active) return;
        setProducts(activeProducts);
        setCategories(activeCategories);
        setError('');
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

  const categoryProducts = category
    ? products.filter((product) => product.category === category)
    : products;

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
          All pieces <span>{products.length}</span>
        </Link>
        {categories.map(({ name }) => (
          <Link
            key={name}
            to={`/shop?category=${encodeURIComponent(name)}`}
            className={`shop-category-link ${category === name ? 'active' : ''}`}
            aria-current={category === name ? 'page' : undefined}
          >
            {name} <span>{products.filter((product) => product.category === name).length}</span>
          </Link>
        ))}
      </nav>

      {error && <p className="alert alert-danger" role="alert">Could not load the collection: {error}</p>}
      {loading && <p className="text-center py-5" role="status">Loading jewellery…</p>}

      <div className="row g-4">
        {!loading && !error && categoryProducts.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-6">
            <ProductCard
              product={product}
            />
          </div>
        ))}
        {!loading && !error && categoryProducts.length === 0 && (
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