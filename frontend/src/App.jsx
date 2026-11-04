import { useState } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { Navigate, Route, Routes, useLocation } from 'react-router';
// import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickView from './components/ProductQuickView';
import Home from './pages/Home';
import Policy from './pages/Policy';
import Shop from './pages/Shop';
import { CLIENT_INFO } from './data/products';

export default function App() {
  const { pathname } = useLocation();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isHomePage = pathname === '/';

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`min-vh-100 d-flex flex-column bg-light${isHomePage ? ' position-relative' : ''}`}>
      {/* <AnnouncementBar /> */}
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        transparent={isHomePage}
      />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onQuickView={setSelectedProduct}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                onQuickView={setSelectedProduct}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/policy" element={<Policy />} />
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
      <ProductQuickView
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
}