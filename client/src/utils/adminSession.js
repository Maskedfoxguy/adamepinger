
import { useSyncExternalStore } from 'react';

/*
 * Central Admin Session Manager
 *
 * - 60-minute inactivity timeout
 * - Browser session storage
 * - Server-side activity heartbeat
 * - Automatic logout after expiration
 */

const SESSION_TIMEOUT = 60 * 60 * 1000;
const HEARTBEAT_INTERVAL = 5 * 60 * 1000;

const TOKEN_KEY = 'adminToken';
const LAST_ACTIVITY_KEY = 'adminLastActivity';
const SESSION_CHANGE = 'admin-session-change';
export const ADMIN_REQUEST_TIMEOUT_MS = 8000;

// Save a newly authenticated session.
export function saveAdminSession(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(
    LAST_ACTIVITY_KEY,
    Date.now().toString()
  );
  window.dispatchEvent(new Event(SESSION_CHANGE));
}

// Retrieve the stored token.
export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// Delete local session information.
export function clearAdminSession(token = getAdminToken()) {
  if (!token || token !== getAdminToken()) {
    return;
  }
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE));
}

function subscribeToAdminSession(listener) {
  window.addEventListener(SESSION_CHANGE, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(SESSION_CHANGE, listener);
    window.removeEventListener('storage', listener);
  };
}

export function useAdminToken() {
  return useSyncExternalStore(subscribeToAdminSession, getAdminToken);
}

// The server verifies the token. Its expiry claim is only a local timer.
function hasTokenExpired(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(window.atob(payload));
    return typeof exp === 'number' && Date.now() >= exp * 1000;
  } catch {
    return false;
  }
}

// Check local expiry without mutating storage during render.
export function isAdminSessionValid() {
  const token = getAdminToken();
  const lastActivity = Number(
    sessionStorage.getItem(LAST_ACTIVITY_KEY)
  );

  if (!token || !lastActivity || hasTokenExpired(token)) {
    return false;
  }

  const inactiveTime = Date.now() - lastActivity;

  if (
    inactiveTime >= SESSION_TIMEOUT ||
    inactiveTime < 0
  ) {
    return false;
  }

  return true;
}

// Record meaningful website activity.
function updateAdminActivity() {
  if (!isAdminSessionValid()) {
    return;
  }

  sessionStorage.setItem(
    LAST_ACTIVITY_KEY,
    Date.now().toString()
  );
}

// Monitor the admin session across the website.
export function startAdminSessionMonitor(token) {
  let lastRecorded = 0;
  let lastHeartbeat = 0;
  let heartbeatController = null;
  let stopped = false;
  let expired = false;

  function expireSession() {
    if (stopped || expired) {
      return;
    }

    expired = true;
    clearAdminSession(token);
  }

  // Ask Express whether the session is still valid.
  async function sendHeartbeat() {
    if (
      stopped ||
      expired ||
      heartbeatController
    ) {
      return;
    }

    if (!isAdminSessionValid()) {
      expireSession();
      return;
    }

    if (getAdminToken() !== token) {
      return;
    }

    heartbeatController = new AbortController();
    const timeout = setTimeout(() => heartbeatController?.abort(), ADMIN_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch('/auth/heartbeat', {
        method: 'POST',
        cache: 'no-store',
        signal: heartbeatController.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (stopped || expired) {
        return;
      }

      if (response.status === 401) {
        expireSession();
        return;
      }

      if (!response.ok) {
        // Temporary server errors should not log out
        // the admin. Retry on later activity.
        return;
      }

      lastHeartbeat = Date.now();
    } catch (error) {
      // A temporary network failure is not necessarily
      // an expired session.
      if (!stopped) {
        console.warn('Admin session heartbeat failed.', error);
      }
    } finally {
      clearTimeout(timeout);
      heartbeatController = null;
    }
  }

  function checkSession() {
    if (stopped || expired) {
      return;
    }

    if (!isAdminSessionValid()) {
      expireSession();
    }
  }

  function recordActivity() {
    if (stopped || expired) {
      return;
    }

    // Always check expiration before renewing activity.
    if (!isAdminSessionValid()) {
      expireSession();
      return;
    }

    const now = Date.now();

    // Limit writes to sessionStorage.
    if (now - lastRecorded >= 5000) {
      lastRecorded = now;
      updateAdminActivity();
    }

    // Contact the server at most once every 5 minutes
    // during normal activity.
    if (now - lastHeartbeat >= HEARTBEAT_INTERVAL) {
      sendHeartbeat();
    }
  }

  const events = [
    'click',
    'keydown',
    'pointerdown',
    'scroll',
    'touchstart',
  ];

  events.forEach((eventName) => {
    window.addEventListener(
      eventName,
      recordActivity,
      { passive: true }
    );
  });

  // Check expiration even when the user is inactive.
  const interval = setInterval(checkSession, 10000);

  function checkOnReturn() {
    if (!document.hidden) {
      checkSession();
    }
  }

  window.addEventListener('focus', checkSession);

  document.addEventListener(
    'visibilitychange',
    checkOnReturn
  );

  // Verify the server session when monitoring starts.
  checkSession();

  if (!expired) {
    sendHeartbeat();
  }

  // Remove listeners when the component unmounts.
  return () => {
    stopped = true;
    heartbeatController?.abort();

    events.forEach((eventName) => {
      window.removeEventListener(
        eventName,
        recordActivity
      );
    });

    clearInterval(interval);

    window.removeEventListener(
      'focus',
      checkSession
    );

    document.removeEventListener(
      'visibilitychange',
      checkOnReturn
    );
  };
}
