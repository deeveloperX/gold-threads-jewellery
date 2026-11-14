import { useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiCreditCard,
  FiDroplet,
  FiGift,
  FiShoppingBag,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import { Link, useParams } from 'react-router';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

export default function ProductDetails({ onAddToCart }) {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    productId: null,
    loading: true,
    product: null,
    relatedProducts: [],
    error: '',
    relatedError: '',
  });

  useEffect(() => {
    let active = true;
    productService.getProduct(productId)
      .then((activeProduct) => {
        if (!active) return;
        setProductData({
          productId,
          loading: false,
          product: activeProduct,
          relatedProducts: [],
          error: '',
          relatedError: '',
        });
        productService.getProducts({ category: activeProduct.category })
          .then((products) => {
            if (active) {
              setProductData((current) => current.productId === productId
                ? {
                    ...current,
                    relatedProducts: products
                      .filter((item) => item.id !== activeProduct.id)
                      .slice(0, 3),
                  }
                : current);
            }
          })
          .catch((requestError) => {
            if (active) {
              setProductData((current) => current.productId === productId
                ? { ...current, relatedError: requestError.message }
                : current);
            }
          });
      })
      .catch((requestError) => {
        if (active) {
          setProductData({
            productId,
            loading: false,
            product: null,
            relatedProducts: [],
            error: requestError.status === 404 ? 'Product not found' : requestError.message,
            relatedError: '',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const isCurrentProduct = productData.productId === productId;
  const loading = !isCurrentProduct || productData.loading;
  const product = isCurrentProduct ? productData.product : null;
  const relatedProducts = isCurrentProduct ? productData.relatedProducts : [];
  const error = isCurrentProduct ? productData.error : '';
  const relatedError = isCurrentProduct ? productData.relatedError : '';

  if (loading) {
    return <section className="container py-5 text-center" role="status">Loading product…</section>;
  }

  if (error || !product) {
    return (
      <section className="container py-5 text-center">
        <h1 className="h2 mb-3">{error === 'Product not found' ? error : 'Could not load this product'}</h1>
        <p className="text-muted mb-4">{error || 'This piece may no longer be available.'}</p>
        <Link to="/shop" className="btn btn-dark rounded-pill px-4">
          Return to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="container-xl py-4 py-lg-5">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="breadcrumb small mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-secondary">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-secondary">
              {product.category}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-4 g-lg-5 align-items-start">
        <div className="col-lg-6">
          <div className="product-details-image-wrap">
            <img className="w-100 h-100 object-fit-cover" src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="py-3">
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="luxury-subtitle text-decoration-none"
            >
              {product.category}
            </Link>
            <h1 className="h2 fw-normal mt-3 mb-3">{product.name}</h1>

            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="text-warning" aria-label={`${product.rating} out of 5 stars`}>★</span>
              <span className="small">{product.rating.toFixed(1)}</span>
              <span className="text-muted small">({product.reviewsCount} reviews)</span>
            </div>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="fs-4 fw-semibold">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-muted text-decoration-line-through">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-secondary lh-lg mb-4">{product.description}</p>

            <p className="small text-muted d-flex align-items-start gap-2 mb-4">
              <FiGift className="brand-gold-color flex-shrink-0" aria-hidden="true" />
              <span>Free gift packaging is included in the product price, with extra charge.</span>
            </p>

            <button
              type="button"
              className="btn btn-outline-gold rounded-pill px-4 py-3 w-100 d-flex justify-content-center align-items-center gap-2"
              onClick={() => onAddToCart(product)}
            >
              <FiShoppingBag aria-hidden="true" />
              Add to Bag
            </button>

            <div className="mt-4 border-top">
              <div className="d-flex justify-content-between gap-3 py-3 border-bottom small">
                <span className="text-muted">Material</span><span className="text-end">{product.material}</span>
              </div>
              <div className="d-flex justify-content-between gap-3 py-3 border-bottom small">
                <span className="text-muted">Waterproof</span><span>{product.waterproof ? 'Yes' : 'No'}</span>
              </div>
              <div className="d-flex justify-content-between gap-3 py-3 border-bottom small">
                <span className="text-muted">Non-tarnish</span><span>{product.nonTarnish ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <Link to="/shop" className="d-inline-flex align-items-center gap-2 mt-4 small text-secondary text-decoration-none">
              <FiArrowLeft aria-hidden="true" />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <section className="row row-cols-2 row-cols-lg-4 g-3 py-5 mt-3 border-top" aria-label="Shopping information">
        <div className="col">
          <div className="h-100 p-3 p-md-4 bg-white border">
            <FiTruck className="brand-gold-color mb-3" size={22} aria-hidden="true" />
            <h2 className="h6 fw-semibold">Delivery across Pakistan</h2>
            <p className="small text-muted mb-0">Reliable courier delivery to cities nationwide.</p>
          </div>
        </div>
        <div className="col">
          <div className="h-100 p-3 p-md-4 bg-white border">
            <FiCreditCard className="brand-gold-color mb-3" size={22} aria-hidden="true" />
            <h2 className="h6 fw-semibold">Flexible payment</h2>
            <p className="small text-muted mb-0">Cash on delivery and card payments accepted.</p>
          </div>
        </div>
        <div className="col">
          <div className="h-100 p-3 p-md-4 bg-white border">
            <FiDroplet className="brand-gold-color mb-3" size={22} aria-hidden="true" />
            <h2 className="h6 fw-semibold">Waterproof wear</h2>
            <p className="small text-muted mb-0">
              {product.waterproof ? 'Made for everyday wear around water.' : 'See product details for care guidance.'}
            </p>
          </div>
        </div>
        <div className="col">
          <div className="h-100 p-3 p-md-4 bg-white border">
            <FiShield className="brand-gold-color mb-3" size={22} aria-hidden="true" />
            <h2 className="h6 fw-semibold">Final sale</h2>
            <p className="small text-muted mb-0">
              <Link to="/policy" className="text-secondary">Review our return policy</Link> before ordering.
            </p>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="pt-4 pb-5 border-top" aria-labelledby="related-products-title">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <p className="luxury-subtitle mb-2">Selected for you</p>
              <h2 className="h3 fw-normal mb-0" id="related-products-title">You may also like</h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="small text-secondary text-decoration-none"
            >
              Shop {product.category}
            </Link>
          </div>
          <div className="row g-3 g-lg-4">
            {relatedProducts.map((relatedProduct) => (
              <div className="col-6 col-lg-4" key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </section>
      )}
      {relatedError && <p className="alert alert-danger mt-4" role="alert">Could not load related products: {relatedError}</p>}
    </section>
  );
}
