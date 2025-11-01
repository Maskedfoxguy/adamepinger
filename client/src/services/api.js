// Offers lightweight helpers for talking to the Express backend.
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request(path, options = {}) {
  const response = await fetch(path, options);

  if (!response.ok) {
    let message = 'Request failed.';

    try {
      const body = await response.json();
      if (body && body.message) {
        message = body.message;
      }
    } catch (error) {
      // Swallow JSON parse errors so the original status drives the message.
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

export async function fetchAbout() {
  // The about endpoint returns the latest bio entry for the portfolio.
  return request('/api/about');
}

export async function fetchProjects() {
  // Portfolio projects are exposed under the /api/portfolio namespace.
  return request('/api/portfolio');
}

export async function loginAdmin(credentials) {
  // Sends admin credentials to the auth endpoint and returns the issued token.
  return request('/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
}
