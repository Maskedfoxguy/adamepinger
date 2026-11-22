import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { verifyAdminSession } from '../services/api';
import { isAdminSessionValid, useAdminToken } from '../utils/adminSession';
import '../pages/AdminDashboardPage.css';

function VerifyProtectedEntry() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<'checking' | 'verified' | 'retry'>('checking');

  useEffect(() => {
    let active = true;
    verifyAdminSession().then(
      () => { if (active) setResult('verified'); },
      () => { if (active) setResult('retry'); },
    );
    return () => { active = false; };
  }, [attempt]);

  if (result === 'verified') {
    return <Outlet />;
  }

  return (
    <section className="admin-dashboard-page">
      <div className="admin-dashboard-shell admin-panel">
        {result === 'checking' ? (
          <p role="status">Checking your admin session…</p>
        ) : (
          <>
            <p role="alert">Unable to verify your admin session. Please try again.</p>
            <button type="button" onClick={() => {
              setResult('checking');
              setAttempt(previous => previous + 1);
            }}>Retry session check</button>
          </>
        )}
      </div>
    </section>
  );
}

export default function ProtectedRoute() {
  const token = useAdminToken();
  const location = useLocation();
  if (!token || !isAdminSessionValid()) {
    return <Navigate to="/login" replace />;
  }

  return <VerifyProtectedEntry key={`${location.key}:${token}`} />;
}
