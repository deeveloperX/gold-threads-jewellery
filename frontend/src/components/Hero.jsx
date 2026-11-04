import { FiArrowRight } from 'react-icons/fi';

export default function Hero({ onCtaClick }) {
  return (
    <section className="hero-banner d-flex align-items-end text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-5 mb-md-5">
            <p className="hero-copy fw-light lh-base mb-4">
              Discover thoughtfully chosen jewellery with timeless details and refined finishes, made to bring a little elegance to every day.
            </p>
            <button
              type="button"
              onClick={onCtaClick}
              className="hero-cta btn btn-link p-0 text-decoration-none text-light d-inline-flex align-items-center gap-2"
            >
              <span className="hero-cta-label text-uppercase border-bottom border-light pb-1">
                Choose your style
              </span>
              <FiArrowRight className="hero-cta-arrow" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}