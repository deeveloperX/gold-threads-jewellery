import {
  FiAlertCircle,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { Link } from 'react-router';
import { SiWhatsapp } from 'react-icons/si';
import { CLIENT_INFO } from '../data/products';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem }) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    
    let message = `Hello *${CLIENT_INFO.name}*,\n\nI would like to place an order for:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} x PKR ${item.price.toLocaleString()} = PKR ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total Amount:* PKR ${total.toLocaleString()}\n*Payment Method:* Cash on Delivery / Card\n*Delivery Address:* [Please enter your full address & city here]`;

    const encoded = encodeURIComponent(message);
    window.open(
      `https://wa.me/${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}?text=${encoded}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div
      className={`cart-drawer-backdrop position-fixed top-0 end-0 bottom-0 start-0 d-flex justify-content-end ${isOpen ? 'is-open' : ''}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="cart-drawer-panel bg-white w-100 d-flex flex-column h-100 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="cart-drawer-header d-flex justify-content-between align-items-center">
          <div>
            <p className="luxury-subtitle mb-1">Your selection</p>
            <h2 className="cart-drawer-title m-0" id="cart-drawer-title">
              The Bag <span>({itemCount})</span>
            </h2>
          </div>
          <button
            className="cart-close-button d-flex align-items-center justify-content-center"
            onClick={onClose}
            aria-label="Close cart"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty-state my-auto text-center px-4 py-5">
            <FiShoppingBag className="cart-empty-icon mb-3" size={34} aria-hidden="true" />
            <h3 className="h5 mb-2">Your bag is waiting</h3>
            <p className="text-muted small mb-4">Discover a piece made to be treasured.</p>
            <button className="btn btn-outline-dark rounded-pill px-4" onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="cart-items flex-grow-1 overflow-auto">
            {cart.map((item) => (
              <article key={item.id} className="cart-item d-flex gap-3">
                <img src={item.image} alt={item.name} className="cart-item-image object-fit-cover" />
                <div className="cart-item-info flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <p className="cart-item-category mb-1">{item.category}</p>
                      <h3 className="cart-item-name mb-2">{item.name}</h3>
                    </div>
                    <button
                      className="cart-remove-button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <FiTrash2 size={16} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="cart-item-price mb-3">PKR {item.price.toLocaleString()}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="cart-quantity-control d-flex align-items-center">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <FiMinus size={13} aria-hidden="true" />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <FiPlus size={13} aria-hidden="true" />
                      </button>
                    </div>
                    <span className="cart-item-total">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
              <div className="cart-policy-note d-flex align-items-start gap-2">
                <FiAlertCircle className="flex-shrink-0 mt-1" size={16} aria-hidden="true" />
                <p className="small mb-0">
                  Please note: <Link to="/policy" className="text-secondary">Review our return policy</Link> before ordering.
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="cart-subtotal-label">Subtotal</span>
                <span className="cart-subtotal">PKR {total.toLocaleString()}</span>
              </div>
              <button
                className="cart-checkout-button btn w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleWhatsAppCheckout}
              >
                <SiWhatsapp size={18} aria-hidden="true" />
                Checkout on WhatsApp
              </button>
              <p className="cart-payment-note text-center mb-0 mt-2">Cash on delivery or card accepted</p>
          </div>
        )}
      </div>
    </div>
  );
}