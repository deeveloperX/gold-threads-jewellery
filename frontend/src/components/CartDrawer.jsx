import { CLIENT_INFO } from '../data/products';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem }) {
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
        className="cart-drawer-panel bg-white w-100 mw-md-400 p-4 d-flex flex-column h-100 shadow-lg"
        style={{ maxWidth: '420px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <h5 className="fw-bold m-0" id="cart-drawer-title">
            Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h5>
          <button className="btn-close" onClick={onClose} aria-label="Close cart"></button>
        </div>

        {cart.length === 0 ? (
          <div className="my-auto text-center py-5 text-muted">
            <p className="fs-1 mb-2">🛍️</p>
            <p className="fw-medium">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="flex-grow-1 overflow-auto pe-1">
            {cart.map((item) => (
              <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom align-items-center">
                <img src={item.image} alt={item.name} className="rounded-3 object-fit-cover" style={{ width: '70px', height: '70px' }} />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1 fs-6">{item.name}</h6>
                  <p className="small text-muted mb-2">PKR {item.price.toLocaleString()}</p>
                  
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}>-</button>
                    <span className="fw-semibold small">{item.quantity}</span>
                    <button className="btn-sm btn btn-outline-secondary py-0 px-2" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                  </div>
                </div>
                <button className="btn btn-sm text-danger border-0" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name} from cart`}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        <div className="border-top pt-3 mt-auto">
          <div className="d-flex justify-content-between fw-bold mb-2">
            <span>Subtotal:</span>
            <span className="text-dark">PKR {total.toLocaleString()}</span>
          </div>

          <div className="alert alert-warning py-2 px-3 small mb-3 border-warning border-opacity-25">
            ⚠️ <strong>Notice:</strong> We have a strict <u>No Refund & No Return</u> policy.
          </div>

          <button 
            className="btn btn-success w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mb-2"
            onClick={handleWhatsAppCheckout}
            disabled={cart.length === 0}
          >
            <span>💬 Order via WhatsApp (COD / Card)</span>
          </button>
        </div>

      </div>
    </div>
  );
}