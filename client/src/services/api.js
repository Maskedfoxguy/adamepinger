
import {
  getAdminToken,
  isAdminSessionValid,
  clearAdminSession,
  ADMIN_REQUEST_TIMEOUT_MS,
} from '../utils/adminSession';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

// Central helper for API requests.
async function request(path, options = {}, token) {
  const response = await fetch(path, options);

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAdminSession(token);
    }
    let message = 'Request failed.';

    try {
      const body = await response.json();

      if (body && body.message) {
        message = body.message;
      } else if (
        body &&
        Array.isArray(body.errors) &&
        body.errors.length > 0
      ) {
        message = body.errors
          .map((error) => error.message)
          .join(' ');
      }
    } catch (error) {
      // Keep the default message if response parsing fails.
    }

    const apiError = new Error(message);
    apiError.status = response.status;

    throw apiError;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function adminRequest(path, options = {}) {
  const token = getAdminToken();
  if (!isAdminSessionValid()) {
    clearAdminSession(token);

    const error = new Error(
      'Your admin session has expired. Please log in again.'
    );

    error.status = 401;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ADMIN_REQUEST_TIMEOUT_MS);
  try {
    return await request(path, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
      headers: { ...JSON_HEADERS, Authorization: 'Bearer ' + token },
    }, token);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('The server took too long to respond.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// PUBLIC API

export async function fetchAbout() {
  return request('/api/about');
}

export async function fetchProjects() {
  return request('/api/portfolio');
}

// ADMIN LOGIN

export async function loginAdmin(credentials) {
  return request('/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
}

export function verifyAdminSession() {
  return adminRequest('/auth/verify');
}

export async function logoutAdmin() {
  const token = getAdminToken();
  try {
    if (token) {
      await adminRequest('/auth/logout', { method: 'POST' });
    }
  } finally {
    clearAdminSession(token);
  }
}

// ADMIN ACCOUNT

export async function fetchAdminAccount() {
  return adminRequest('/api/admin/account');
}

export async function updateAdminAccount(accountData) {
  return adminRequest('/api/admin/account', {
    method: 'PUT',
    body: JSON.stringify(accountData),
  });
}

// ADMIN PROJECTS

export async function createAdminProject(projectData) {
  return adminRequest('/api/admin/portfolio', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}
