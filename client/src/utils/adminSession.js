
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

// Save a newly authenticated session.
export function saveAdminSession(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(
    LAST_ACTIVITY_KEY,
    Date.now().toString()
  );
}

// Retrieve the stored token.
export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

// Delete local session information.
export function clearAdminSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}

// Check the local inactivity timeout.
export function isAdminSessionValid() {
  const token = getAdminToken();
  const lastActivity = Number(
    sessionStorage.getItem(LAST_ACTIVITY_KEY)
  );

  if (!token || !lastActivity) {
    return false;
  }

  const inactiveTime = Date.now() - lastActivity;

  if (
    inactiveTime >= SESSION_TIMEOUT ||
    inactiveTime < 0
  ) {
    clearAdminSession();
    return false;
  }

  return true;
}

// Record meaningful website activity.
export function updateAdminActivity() {
  if (!isAdminSessionValid()) {
    return;
  }

  sessionStorage.setItem(
    LAST_ACTIVITY_KEY,
    Date.now().toString()
  );
}

// Monitor the admin session across the website.
export function startAdminSessionMonitor(onExpire) {
  let lastRecorded = 0;
  let lastHeartbeat = 0;
  let heartbeatInProgress = false;
  let stopped = false;
  let expired = false;

  function expireSession() {
    if (stopped || expired) {
      return;
    }

    expired = true;
    clearAdminSession();
    onExpire();
  }

  // Ask Express whether the session is still valid.
  async function sendHeartbeat() {
    if (
      stopped ||
      expired ||
      heartbeatInProgress
    ) {
      return;
    }

    if (!isAdminSessionValid()) {
      expireSession();
      return;
    }

    const token = getAdminToken();

    if (!token) {
      expireSession();
      return;
    }

    heartbeatInProgress = true;

    try {
      const response = await fetch('/auth/heartbeat', {
        method: 'POST',
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
      console.warn(
        'Admin session heartbeat failed.',
        error
      );
    } finally {
      heartbeatInProgress = false;
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
