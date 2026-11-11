import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import { Navigate, useLocation } from 'react-router';
import useAdminAuth from './useAdminAuth';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const { status, profileError, refreshProfile } = useAdminAuth();

  if (status === 'checking') {
    return (
      <main className="admin-auth-state" aria-live="polite">
        <FiLoader className="admin-auth-spinner" aria-hidden="true" />
        <p>Checking your admin session…</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="admin-auth-state" role="alert">
        <FiAlertCircle aria-hidden="true" />
        <h1>Couldn’t verify your session</h1>
        <p>{profileError}</p>
        <button type="button" className="admin-primary-button" onClick={refreshProfile}>
          Try again
        </button>
      </main>
    );
  }

  if (status !== 'authenticated') {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(returnTo)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
