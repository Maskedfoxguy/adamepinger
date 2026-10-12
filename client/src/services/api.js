
import {
  getAdminToken,
  isAdminSessionValid,
  clearAdminSession,
} from '../utils/adminSession';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

// Central helper for API requests.
async function request(path, options = {}) {
  const response = await fetch(path, options);

  if (!response.ok) {
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

    // Unauthorized admin request: remove session.
    if (response.status === 401 && options.adminRequest) {
      clearAdminSession();
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

// Prepare authentication headers for admin requests.
function createAdminHeaders() {
  // Do not allow API requests with expired sessions.
  if (!isAdminSessionValid()) {
    clearAdminSession();

    const error = new Error(
      'Your admin session has expired. Please log in again.'
    );

    error.status = 401;
    throw error;
  }

  const adminToken = getAdminToken();

  return {
    ...JSON_HEADERS,
    Authorization: 'Bearer ' + adminToken,
  };
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

// ADMIN ACCOUNT

export async function fetchAdminAccount() {
  return request('/api/admin/account', {
    headers: createAdminHeaders(),
    adminRequest: true,
  });
}

export async function updateAdminAccount(accountData) {
  return request('/api/admin/account', {
    method: 'PUT',
    headers: createAdminHeaders(),
    body: JSON.stringify(accountData),
    adminRequest: true,
  });
}

// ADMIN PROJECTS

export async function createAdminProject(projectData) {
  return request('/api/admin/portfolio', {
    method: 'POST',
    headers: createAdminHeaders(),
    body: JSON.stringify(projectData),
    adminRequest: true,
  });
}
