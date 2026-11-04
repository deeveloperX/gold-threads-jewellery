import { FiArrowRight } from 'react-icons/fi';

export default function Hero({ onCtaClick }) {
  return (
    <section className="hero-banner d-flex align-items-end text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-5">
            <p className="fw-light lh-base mb-4">
              Personalized service that goes beyond expectations: together, we'll craft the ring of your dreams.
            </p>
            <button
              type="button"
              onClick={onCtaClick}
              className="btn btn-link p-0 text-decoration-none text-light d-inline-flex align-items-center gap-2"
            >
              <span className="text-uppercase border-bottom border-light pb-1">
                Choose your ring
              </span>
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}