import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FiArrowRight } from 'react-icons/fi';
import { categoryService } from '../services/categoryService';

export default function PopularCollections() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    categoryService.getPopularCategories()
      .then((categories) => {
        if (active) setCollections(categories);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <section className="container py-5">
        <p className="alert alert-danger" role="alert">Could not load collections: {error}</p>
      </section>
    );
  }
  if (collections.length === 0) return null;

  return (
    <section className="container py-5">
          <h2 className=" mb-5 text-center">Popular Collections</h2>
        <div className="popular-collections-grid">
          {collections.map(({ name: category, imagePath }) => (
            <Link
              key={category}
              to={`/shop?category=${encodeURIComponent(category)}`}
              className="collection-card text-decoration-none"
              aria-label={`Shop ${category}`}
            >
              <img src={imagePath} alt="" className="collection-card-image" />
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
