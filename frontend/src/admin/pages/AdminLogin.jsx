import { useState } from 'react';
import { FiAlertCircle, FiArrowRight, FiEye, FiEyeOff, FiLoader, FiLock } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router';
import useAdminAuth from '../auth/useAdminAuth';

export default function AdminLogin() {
  const { login, status } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      const returnTo = new URLSearchParams(location.search).get('next')
        || location.state?.from?.pathname;
      const allowedDestinations = ['/admin', '/admin/products', '/admin/categories'];
      navigate(allowedDestinations.includes(returnTo) ? returnTo : '/admin', { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'authenticated' && !isSubmitting) {
    return (
      <main className="admin-login-preview">
        <section className="admin-login-card">
          <span className="admin-login-icon"><FiLock aria-hidden="true" /></span>
          <span className="admin-eyebrow">ADMIN ACCESS</span>
          <h1>You’re signed in</h1>
          <p>Your admin session is active.</p>
          <button type="button" className="admin-primary-button admin-login-submit" onClick={() => navigate('/admin')}>
            Continue to admin
            <FiArrowRight aria-hidden="true" />
          </button>
          <Link to="/" className="admin-login-back">Return to storefront</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-login-preview">
      <section className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          <span className="admin-brand-mark">GT</span>
          <span className="admin-brand-copy">
            <strong>GOLD THREADS</strong>
            <small>JEWELLERY · ADMIN</small>
          </span>
        </Link>
        <span className="admin-login-icon"><FiLock aria-hidden="true" /></span>
        <span className="admin-eyebrow">ADMIN ACCESS</span>
        <h1>Welcome back</h1>
        <p>Sign in to manage your Gold Threads catalogue.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-login-error" role="alert">
              <FiAlertCircle aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          <label className="admin-login-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>
          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <span className="admin-password-input">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                aria-label="Password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </span>
          </div>
          <button type="submit" className="admin-primary-button admin-login-submit" disabled={isSubmitting}>
            {isSubmitting ? <FiLoader className="admin-auth-spinner" aria-hidden="true" /> : null}
            {isSubmitting ? 'Signing in…' : 'Sign in'}
            {!isSubmitting && <FiArrowRight aria-hidden="true" />}
          </button>
        </form>

        <div className="admin-login-security">
          <FiLock aria-hidden="true" />
          <span>Your token is kept in this browser tab and sent only to protected admin API endpoints.</span>
        </div>
        <Link to="/" className="admin-login-back">Return to storefront</Link>
      </section>
    </main>
  );
}
