import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Link, useNavigate } from 'react-router';

export default function Home({ onQuickView, onAddToCart }) {
  const featured = PRODUCTS.slice(0, 4);
  const navigate = useNavigate();

  return (
    <div>
      <Hero onCtaClick={() => navigate('/shop')} />
      {/* <FeatureBadges /> */}

      {/* Featured Products */}
      <section className="py-5 container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold m-0">Trending Collections</h2>
            <p className="text-muted mb-0 small">High quality designer pieces ranging from PKR 999 to 1,300</p>
          </div>
          <Link className="btn btn-outline-dark rounded-pill fw-semibold" to="/shop">
            View All →
          </Link>
        </div>

        <div className="row g-4">
          {featured.map(product => (
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
    </div>
  );
}