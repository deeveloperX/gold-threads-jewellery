import { useEffect, useState } from 'react';
import { FiCheck, FiTruck } from 'react-icons/fi';
import { authService } from '../../services/authService';
import { settingsService } from '../../services/settingsService';

const emptyCredentials = {
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function StoreSettings({ token, admin, onCredentialsSaved }) {
  const [shippingFee, setShippingFee] = useState('0');
  const [codEnabled, setCodEnabled] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutSaving, setCheckoutSaving] = useState(false);

  const [credentials, setCredentials] = useState(() => ({
    ...emptyCredentials,
    name: admin?.name || '',
    email: admin?.email || '',
  }));
  const [credentialsError, setCredentialsError] = useState('');
  const [credentialsMessage, setCredentialsMessage] = useState('');
  const [credentialsSaving, setCredentialsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    settingsService.getSettings()
      .then((settings) => {
        if (!active) return;
        setShippingFee(String(settings.shippingFee ?? 0));
        setCodEnabled(Boolean(settings.codEnabled));
        setCheckoutError('');
      })
      .catch((error) => {
        if (active) setCheckoutError(error.message);
      })
      .finally(() => {
        if (active) setCheckoutLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const saveCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');
    setCheckoutMessage('');
    if (!/^\d+$/.test(shippingFee.trim())) {
      setCheckoutError('Enter a shipping fee in whole rupees.');
      return;
    }

    setCheckoutSaving(true);
    try {
      const saved = await settingsService.updateSettings(token, {
        shippingFee: Number(shippingFee.trim()),
        codEnabled,
      });
      setShippingFee(String(saved.shippingFee));
      setCodEnabled(saved.codEnabled);
      setCheckoutMessage('Checkout settings saved. They apply to the storefront cart.');
    } catch (error) {
      setCheckoutError(error.message);
    } finally {
      setCheckoutSaving(false);
    }
  };

  const saveCredentials = async (event) => {
    event.preventDefault();
    setCredentialsError('');
    setCredentialsMessage('');

    const name = credentials.name.trim();
    const email = credentials.email.trim();
    if (!name) {
      setCredentialsError('Enter the name shown in the admin workspace.');
      return;
    }
    if (credentials.newPassword || credentials.confirmPassword) {
      if (credentials.newPassword.length < 8) {
        setCredentialsError('Use a new password of at least 8 characters.');
        return;
      }
      if (credentials.newPassword !== credentials.confirmPassword) {
        setCredentialsError('New password and confirmation do not match.');
        return;
      }
    }
    if (!credentials.currentPassword) {
      setCredentialsError('Enter your current password to save these changes.');
      return;
    }

    setCredentialsSaving(true);
    try {
      const saved = await authService.updateCredentials(token, {
        name,
        email,
        currentPassword: credentials.currentPassword,
        newPassword: credentials.newPassword,
      });
      setCredentials({
        ...emptyCredentials,
        name: saved.name,
        email: saved.email,
      });
      setCredentialsMessage(credentials.newPassword
        ? 'Name, email, and password updated. Use the new password next time you sign in.'
        : 'Account details updated.');
      onCredentialsSaved?.(saved);
    } catch (error) {
      setCredentialsError(error.message);
    } finally {
      setCredentialsSaving(false);
    }
  };

  const updateCredential = (field) => (event) => {
    setCredentials((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <div className="admin-settings-grid">
      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="admin-panel-kicker">CHECKOUT</span>
            <h2>Shipping and cash on delivery</h2>
          </div>
          <FiTruck aria-hidden="true" />
        </div>
        <p className="admin-settings-lead">
          The shipping fee is added to every storefront order. Cash on delivery can be offered or turned off.
        </p>
        {checkoutLoading ? (
          <p className="admin-settings-status">Loading checkout settings…</p>
        ) : (
          <form className="admin-form" onSubmit={saveCheckout}>
            {checkoutError && <p className="admin-form-error" role="alert">{checkoutError}</p>}
            {checkoutMessage && <p className="admin-form-success" role="status">{checkoutMessage}</p>}
            <div className="admin-form-field">
              <label htmlFor="shipping-fee">Shipping fee (PKR)</label>
              <input
                id="shipping-fee"
                inputMode="numeric"
                value={shippingFee}
                onChange={(event) => setShippingFee(event.target.value)}
                placeholder="0"
              />
              <small>Use 0 for free shipping. Whole rupees only.</small>
            </div>
            <label className="admin-checkbox-field">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(event) => setCodEnabled(event.target.checked)}
              />
              <span>
                <strong>Cash on delivery available</strong>
                <small>Shown in the cart and on the store policy page.</small>
              </span>
            </label>
            <div className="admin-dialog-actions">
              <button type="submit" className="admin-primary-button" disabled={checkoutSaving}>
                <FiCheck aria-hidden="true" />
                {checkoutSaving ? 'Saving…' : 'Save checkout settings'}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="admin-panel admin-settings-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="admin-panel-kicker">ACCESS</span>
            <h2>Admin credentials</h2>
          </div>
        </div>
        <p className="admin-settings-lead">
          Update the name, email, and password used to sign in to this workspace.
        </p>
        <form className="admin-form" onSubmit={saveCredentials}>
          {credentialsError && <p className="admin-form-error" role="alert">{credentialsError}</p>}
          {credentialsMessage && <p className="admin-form-success" role="status">{credentialsMessage}</p>}
          <div className="admin-form-field">
            <label htmlFor="admin-name">Display name</label>
            <input
              id="admin-name"
              value={credentials.name}
              onChange={updateCredential('name')}
              autoComplete="name"
            />
          </div>
          <div className="admin-form-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={credentials.email}
              onChange={updateCredential('email')}
              autoComplete="username"
            />
          </div>
          <div className="admin-form-field">
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              type="password"
              value={credentials.currentPassword}
              onChange={updateCredential('currentPassword')}
              autoComplete="current-password"
            />
            <small>Required to save any change to this account.</small>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                value={credentials.newPassword}
                onChange={updateCredential('newPassword')}
                autoComplete="new-password"
                placeholder="Leave blank to keep"
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={credentials.confirmPassword}
                onChange={updateCredential('confirmPassword')}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="admin-dialog-actions">
            <button type="submit" className="admin-primary-button" disabled={credentialsSaving}>
              <FiCheck aria-hidden="true" />
              {credentialsSaving ? 'Saving…' : 'Save credentials'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
