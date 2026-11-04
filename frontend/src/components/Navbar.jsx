import { useState } from 'react';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { Link, NavLink } from 'react-router';

export default function Navbar({ cartCount = 0, setIsCartOpen, transparent = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className={`navbar navbar-expand-lg border-bottom border-dark border-opacity-25 ${transparent ? 'navbar-transparent position-absolute top-0 start-0 w-100' : 'navbar-site sticky-top'}`}>
      <div className="container-fluid navbar-inner px-3 px-lg-5">
        <button
          className={`navbar-toggler navbar-menu-toggle text-light border-0 d-lg-none p-0 ${mobileMenuOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="navbarContent"
        >
          <span className="navbar-toggle-icon navbar-toggle-menu" aria-hidden="true"><FiMenu size={23} /></span>
          <span className="navbar-toggle-icon navbar-toggle-close" aria-hidden="true"><FiX size={23} /></span>
        </button>

        <div className={`navbar-collapse navbar-menu ${mobileMenuOpen ? 'is-open' : ''}`} id="navbarContent">
          <ul className="navbar-nav mb-0 gap-lg-4 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className="nav-link p-0 text-decoration-none text-uppercase tracking-wider fs-7 text-light opacity-90"
                style={{ fontFamily: "'Prata', serif", letterSpacing: '0.12em', fontSize: '0.85rem' }}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/shop"
                className="nav-link p-0 text-decoration-none text-uppercase tracking-wider fs-7 text-light opacity-90"
                style={{ fontFamily: "'Prata', serif", letterSpacing: '0.12em', fontSize: '0.85rem' }}
                onClick={closeMobileMenu}
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/policy"
                className="nav-link p-0 text-decoration-none text-uppercase tracking-wider fs-7 text-light opacity-90"
                style={{ fontFamily: "'Prata', serif", letterSpacing: '0.12em', fontSize: '0.85rem' }}
                onClick={closeMobileMenu}
              >
                Policies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className="nav-link p-0 text-decoration-none text-uppercase tracking-wider fs-7 text-light opacity-90"
                style={{ fontFamily: "'Prata', serif", letterSpacing: '0.12em', fontSize: '0.85rem' }}
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        <Link to="/" className="navbar-logo text-center text-decoration-none" aria-label="Gold Threads Jewelers home">
          <span
            className="d-block text-light fw-bold text-uppercase tracking-widest lh-1"
            style={{ 
              fontFamily: "'Prata', serif", 
              fontSize: '1.2rem', 
              letterSpacing: '0.22em' 
            }}
          >
            GOLD THREADS
          </span>
          <small 
            className="d-block text-light opacity-50 tracking-widest text-uppercase"
            style={{ fontSize: '0.60rem', letterSpacing: '0.45em', marginTop: '2px' }}
          >
            JEWELLERY
          </small>
        </Link>

        <div className="navbar-actions">
          
          <button 
            className="btn btn-link text-light p-0 position-relative opacity-90 hover-opacity-100 transition"
            title="Bag"
            aria-label={`Shopping bag, ${cartCount} items`}
            onClick={() => setIsCartOpen(true)}
          >
            <FiShoppingBag size={22} />
            <span 
              className="position-absolute translate-middle-x badge rounded-circle bg-light text-dark d-flex align-items-center justify-content-center"
              style={{ 
                top: '55%', 
                left: '50%', 
                width: '14px', 
                height: '14px', 
                fontSize: '0.6rem',
                fontWeight: '700'
              }}
              aria-hidden="true"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}