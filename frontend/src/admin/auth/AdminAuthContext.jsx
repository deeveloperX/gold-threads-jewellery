import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authService } from '../../services/authService';
import AdminAuthContext from './adminAuthContext';

async function verifyAdminSession(token) {
  const profile = await authService.getProfile(token);
  if (!profile?._id) {
    throw new Error('The admin profile response was invalid.');
  }
  return profile;
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState(() => authService.getToken() ? 'checking' : 'unauthenticated');
  const [profileError, setProfileError] = useState('');
  const authRequestId = useRef(0);

  const refreshProfile = useCallback(async () => {
    const requestId = ++authRequestId.current;
    setProfileError('');
    const token = authService.getToken();
    if (!token) {
      setAdmin(null);
      setStatus('unauthenticated');
      return;
    }

    setStatus('checking');
    try {
      const profile = await verifyAdminSession(token);
      if (requestId !== authRequestId.current) return;
      setAdmin(profile);
      setStatus('authenticated');
    } catch (error) {
      if (requestId !== authRequestId.current) return;
      setAdmin(null);
      if (error.status === 401) {
        authService.logout();
        setStatus('unauthenticated');
      } else {
        setStatus('error');
        setProfileError(error.message);
      }
    }
  }, []);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return undefined;

    let active = true;
    const requestId = authRequestId.current;
    verifyAdminSession(token)
      .then((profile) => {
        if (!active || requestId !== authRequestId.current) return;
        setAdmin(profile);
        setStatus('authenticated');
      })
      .catch((error) => {
        if (!active || requestId !== authRequestId.current) return;
        setAdmin(null);
        if (error.status === 401) {
          authService.logout();
          setStatus('unauthenticated');
        } else {
          setStatus('error');
          setProfileError(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const requestId = ++authRequestId.current;
    const profile = await authService.login(email, password);
    if (requestId !== authRequestId.current) {
      throw new Error('Sign-in was interrupted. Please try again.');
    }
    if (!profile?._id || !profile?.token) {
      throw new Error('The login response was invalid.');
    }
    authService.setToken(profile.token);
    setAdmin(profile);
    setProfileError('');
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    authRequestId.current += 1;
    authService.logout();
    setAdmin(null);
    setProfileError('');
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(() => ({
    admin,
    status,
    profileError,
    login,
    logout,
    refreshProfile,
  }), [admin, login, logout, profileError, refreshProfile, status]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
