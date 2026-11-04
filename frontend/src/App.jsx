import { useLayoutEffect, useState } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { Navigate, Route, Routes, useLocation } from 'react-router';
// import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Policy from './pages/Policy';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import { CLIENT_INFO } from './data/products';
import useCart from './hooks/useCart';

export default function App() {
  const { pathname, search } = useLocation();
  const { cart, itemCount, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isHomePage = pathname === '/';

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className={`min-vh-100 d-flex flex-column bg-light${isHomePage ? ' position-relative' : ''}`}>
      {/* <AnnouncementBar /> */}
      <Navbar
        cartCount={itemCount}
        setIsCartOpen={setIsCartOpen}
        transparent={isHomePage}
      />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/product/:productId"
            element={<ProductDetails onAddToCart={handleAddToCart} />}
          />
          <Route path="/policy" element={<Policy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <FloatingWhatsApp
        phoneNumber={CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}
        accountName={CLIENT_INFO.name}
        avatar="/apple-touch-icon.png"
        chatMessage="Hi there! How can we help you?"
        placeholder="Type a message..."
        className="gold-threads-whatsapp"
        allowClickAway
        allowEsc
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeFromCart}
      />
    </div>
  );
}