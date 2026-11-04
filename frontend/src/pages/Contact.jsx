import { FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi';
import { SiTiktok, SiWhatsapp } from 'react-icons/si';
import { CLIENT_INFO } from '../data/products';

const whatsappUrl = `https://wa.me/${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`;
const phoneUrl = `tel:${CLIENT_INFO.whatsappNumber.replace(/\s/g, '')}`;
const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(CLIENT_INFO.address)}`;

export default function Contact() {
  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-muted mb-0">
          We’re happy to help with product and order questions.
        </p>
      </div>

      <div className="row g-3 g-lg-4">
        <div className="col-md-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-card d-flex align-items-start gap-3 h-100 p-4 text-decoration-none"
          >
            <SiWhatsapp className="contact-card-icon flex-shrink-0" size={22} aria-hidden="true" />
            <span>
              <span className="d-block fw-semibold text-dark mb-1">WhatsApp</span>
              <span className="d-block small text-secondary">Message us about a query or order</span>
              <span className="d-block small text-dark mt-2">{CLIENT_INFO.whatsappFormatted}</span>
            </span>
          </a>
        </div>

        <div className="col-md-6">
          <a
            href={phoneUrl}
            className="contact-card d-flex align-items-start gap-3 h-100 p-4 text-decoration-none"
          >
            <FiPhone className="contact-card-icon flex-shrink-0" size={22} aria-hidden="true" />
            <span>
              <span className="d-block fw-semibold text-dark mb-1">Call us</span>
              <span className="d-block small text-secondary">Speak with our team</span>
              <span className="d-block small text-dark mt-2">{CLIENT_INFO.whatsappFormatted}</span>
            </span>
          </a>
        </div>

        <div className="col-md-6">
          <div className="contact-card d-flex align-items-start gap-3 h-100 p-4">
            <FiInstagram className="contact-card-icon flex-shrink-0" size={22} aria-hidden="true" />
            <span>
              <span className="d-block fw-semibold text-dark mb-1">Follow us</span>
              <span className="d-block small text-secondary">Find Gold Threads Jewellery on social media</span>
              <a
                href="https://instagram.com/goldthreadsjewellery"
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center gap-2 small text-dark mt-2 text-decoration-none"
              >
                <FiInstagram size={15} aria-hidden="true" />
                {CLIENT_INFO.handle}
              </a>
              <a
                href="https://www.tiktok.com/@goldthreadsjewellery/"
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center gap-2 small text-dark mt-2 text-decoration-none"
              >
                <SiTiktok size={15} aria-hidden="true" />
                TikTok
              </a>
            </span>
          </div>
        </div>

        <div className="col-md-6">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-card d-flex align-items-start gap-3 h-100 p-4 text-decoration-none"
          >
            <FiMapPin className="contact-card-icon flex-shrink-0" size={22} aria-hidden="true" />
            <span>
              <span className="d-block fw-semibold text-dark mb-1">Visit us</span>
              <span className="d-block small text-secondary">Gulberg, Lahore</span>
              <span className="d-block small text-dark mt-2">{CLIENT_INFO.address}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
