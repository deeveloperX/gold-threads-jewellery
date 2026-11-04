import { Link } from 'react-router';
import { FiArrowRight } from 'react-icons/fi';
import { PRODUCTS } from '../data/products';

const collections = [...new Set(PRODUCTS.map((product) => product.category))]
  .map((category) => ({
    category,
    image: PRODUCTS.find((product) => product.category === category).image,
    productCount: PRODUCTS.filter((product) => product.category === category).length,
  }));

export default function PopularCollections() {
  return (
    <section className="container py-5">
          <h2 className=" mb-5 text-center">Popular Collections</h2>
        <div className="popular-collections-grid">
          {collections.map(({ category, image}) => (
            <Link
              key={category}
              to={`/shop?category=${encodeURIComponent(category)}`}
              className="collection-card text-decoration-none"
              aria-label={`Shop ${category}`}
            >
              <img src={image} alt="" className="collection-card-image" />
              <span className="collection-card-overlay" aria-hidden="true" />
              <span className="collection-card-content">
                <span className="collection-card-title">{category} <FiArrowRight size={14} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
    </section>
  );
}
