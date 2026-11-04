import { FiArrowUpRight, FiInstagram, FiMapPin } from 'react-icons/fi';
import { SiTiktok, SiWhatsapp } from 'react-icons/si';
import { CLIENT_INFO } from '../data/products';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="store-footer mt-5">
      <div className="container py-5">
        <div className="row g-4 g-lg-5 pb-4">
          <div className="col-lg-5 col-md-6">
            <Link to="/" className="store-footer-brand d-inline-block text-decoration-none mb-3">
              <span className="d-block">GOLD THREADS</span>
              <small>JEWELLERY</small>
            </Link>
            <p className="store-footer-copy mb-4">
              Timeless jewellery for everyday wear. Thoughtfully chosen pieces,
              designed to be worn and treasured.
            </p>
            <div className="d-flex gap-2">
              <a
                href="https://instagram.com/goldthreadsjewellery"
                target="_blank"
                rel="noreferrer"
                className="store-footer-social"
                aria-label="Visit Gold Threads on Instagram"
              >
                <FiInstagram size={18} aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="store-footer-social"
                aria-label="Message Gold Threads on WhatsApp"
              >
                <SiWhatsapp size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.tiktok.com/@goldthreadsjewellery/"
                target="_blank"
                rel="noreferrer"
                className="store-footer-social"
                aria-label="Visit Gold Threads on TikTok"
              >
                <SiTiktok size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-3 col-md-3">
            <h2 className="store-footer-heading">Explore</h2>
            <ul className="store-footer-links list-unstyled mb-0">
              <li><Link to="/shop">Shop all jewellery</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
              <li><Link to="/policy">Store policies</Link></li>
            </ul>
          </div>

          <div className="col-6 col-lg-4 col-md-3">
            <h2 className="store-footer-heading">Visit & get in touch</h2>
            <p className="store-footer-detail d-flex align-items-start gap-2 mb-2">
              <FiMapPin className="mt-1 flex-shrink-0" size={15} aria-hidden="true" />
              <span>{CLIENT_INFO.address}</span>
            </p>
            <Link to="/contact" className="store-footer-contact-link">
              More contact details <FiArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="store-footer-bottom d-flex flex-column flex-sm-row justify-content-between gap-2 pt-3">
          <span>© {new Date().getFullYear()} Gold Threads Jewellery</span>
          <span>Made to be treasured.</span>
        </div>
      </div>
    </footer>
  );
}