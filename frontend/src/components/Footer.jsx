import { CLIENT_INFO } from '../data/products';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-5 border-top border-warning border-opacity-25">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-5">
            <h4 className="fw-bold text-warning tracking-wider text-uppercase mb-2">GOLD THREADS</h4>
            <p className="small me-md-4">
              Timeless elegance for everyday wear. Premium designer-inspired stainless steel jewellery. 
              Zero colour fading, 100% waterproof, and tarnish-resistant.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="https://instagram.com/goldthreadsjewellery" target="_blank" rel="noreferrer" className="btn btn-outline-warning btn-sm rounded-pill px-3">
                📸 Instagram
              </a>
              <a href={`https://wa.me/${CLIENT_INFO.whatsappNumber.replace('+', '')}`} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-pill px-3">
                💬 WhatsApp
              </a>
            </div>
          </div>

          <div className="col-md-3">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-grid gap-2">
              <li><Link to="/" className="btn btn-link text-white-50 p-0 text-decoration-none">Home</Link></li>
              <li><Link to="/shop" className="btn btn-link text-white-50 p-0 text-decoration-none">Shop Collection</Link></li>
              <li><Link to="/policy" className="btn btn-link text-white-50 p-0 text-decoration-none">No Refund / Return Policy</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="text-white fw-bold mb-3">Store Details</h6>
            <p className="small mb-1">📍 Gulberg Lahore, Pakistan 54009</p>
            <p className="small mb-1">🚚 Courier Delivery All Over Pakistan</p>
            <p className="small mb-1">💳 Card & Cash on Delivery Accepted</p>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-3 text-center small">
          © {new Date().getFullYear()} Gold Threads Jewellery. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}