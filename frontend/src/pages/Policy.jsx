import {
  FiAlertCircle,
  FiCreditCard,
  FiDroplet,
  FiInstagram,
  FiMapPin,
  FiTruck,
} from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';
import { CLIENT_INFO } from '../data/products';

const policies = [
  {
    title: 'Delivery across Pakistan',
    icon: FiTruck,
    description: 'We deliver to cities and towns nationwide using local courier services.',
    details: [
      'Lahore, Karachi, and Islamabad: 2–4 working days.',
      'Other regions: 3–5 working days.',
    ],
  },
  {
    title: 'Payment options',
    icon: FiCreditCard,
    description: 'Choose the payment option that works best for you.',
    details: ['Cash on Delivery (COD)', 'Credit or debit card', 'Online Bank Tansfer'],
  },
  {
    title: 'Everyday-ready jewellery',
    icon: FiDroplet,
    description:
      'Our stainless steel pieces are designed to be waterproof and tarnish-resistant, with colour made to last.',
    details: [],
  },
];

export default function Policy() {
  return (
    <main className="store-policy">
      <div className="container py-5">
        <div className="mb-4">
          <h1 className="fw-bold">Store Policies</h1>
          <p className="text-muted mb-0">
            Delivery, payment, and important information before you place an order.
          </p>
        </div>

        <section className="store-policy-final-sale p-4 p-md-5 mb-4" aria-labelledby="final-sale-title">
          <div className="d-flex align-items-start gap-3">
            <FiAlertCircle className="store-policy-icon flex-shrink-0 mt-1" size={23} aria-hidden="true" />
            <div>
              <p className="luxury-subtitle mb-2">Please review before purchase</p>
              <h2 className="h4 mb-3" id="final-sale-title">All sales are final</h2>
              <p className="mb-0 text-secondary">
                We do not offer returns, exchanges, or refunds once an order has been dispatched and delivered.
                Please review the product description and images carefully before placing your order.
              </p>
            </div>
          </div>
        </section>

        <section className="row g-3 g-lg-4 mb-5" aria-label="Store policies">
          {policies.map(({ title, icon: Icon, description, details }) => (
            <div className="col-md-4" key={title}>
              <article className="store-policy-card h-100 p-4">
                <Icon className="store-policy-icon mb-3" size={24} aria-hidden="true" />
                <h2 className="h5 mb-2">{title}</h2>
                <p className="small text-secondary mb-3">{description}</p>
                {details.length > 0 && (
                  <ul className="store-policy-list small text-secondary mb-0">
                    {details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                )}
              </article>
            </div>
          ))}
        </section>

        <section className="store-policy-contact p-4 p-md-5" aria-labelledby="contact-title">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="luxury-subtitle mb-2">We’re here to help</p>
              <h2 className="h3 fw-normal mb-2" id="contact-title">Questions about an order?</h2>
              <p className="text-secondary mb-0">
                Reach out to us or visit us in Gulberg, Lahore. We’ll be happy to help.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-3">
                <a
                  className="store-policy-contact-link d-flex align-items-center gap-3"
                  href={`https://wa.me/${CLIENT_INFO.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SiWhatsapp size={19} aria-hidden="true" />
                  <span>{CLIENT_INFO.whatsappFormatted}</span>
                </a>
                <a
                  className="store-policy-contact-link d-flex align-items-center gap-3"
                  href="https://instagram.com/goldthreadsjewellery"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FiInstagram size={19} aria-hidden="true" />
                  <span>{CLIENT_INFO.handle}</span>
                </a>
                <p className="store-policy-contact-link d-flex align-items-center gap-3 mb-0">
                  <FiMapPin size={19} aria-hidden="true" />
                  <span>{CLIENT_INFO.address}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
