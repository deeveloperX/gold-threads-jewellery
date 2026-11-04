import { CLIENT_INFO } from '../data/products';

export default function Policy() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h2 className="fw-bold text-dark border-bottom pb-3 mb-4">Store Policies & Customer Information</h2>
            
            <div className="alert alert-danger border-0 rounded-3 mb-4 p-3">
              <h5 className="fw-bold mb-1">❌ No Refund & No Return Policy</h5>
              <p className="mb-0 small">
                All sales are final. We do not offer returns, exchanges, or cash refunds once an order has been dispatched and delivered. Please make sure to review product details, sizes, and images before placing your order.
              </p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-dark">🚚 Shipping & Delivery Across Pakistan</h5>
              <p className="text-muted small">
                We deliver nationwide to all major cities and towns in Pakistan. Orders are fulfilled via reliable local courier services.
              </p>
              <ul className="text-muted small">
                <li><strong>Payment Options:</strong> Cash on Delivery (COD) & Credit/Debit Card payments.</li>
                <li><strong>Delivery Timeline:</strong> 2 to 4 working days for Lahore, Karachi, Islamabad, and 3 to 5 days for other regions.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-dark">✨ Quality & Waterproof Guarantee</h5>
              <p className="text-muted small">
                Our designer stainless steel jewellery collection is specifically crafted to be 100% waterproof and anti-tarnish (does not turn black). Enjoy wearing your rings, bangles, and necklaces daily with zero color fading!
              </p>
            </div>

            <div className="border-top pt-4 mt-2">
              <h6 className="fw-bold text-dark mb-2">Need Assistance? Contact Us</h6>
              <p className="small text-muted mb-1">📍 <strong>Address:</strong> {CLIENT_INFO.address}</p>
              <p className="small text-muted mb-1">💬 <strong>WhatsApp:</strong> {CLIENT_INFO.whatsappFormatted}</p>
              <p className="small text-muted">📸 <strong>Instagram:</strong> {CLIENT_INFO.handle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}