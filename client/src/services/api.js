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
    } catch (error) {}

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
  return request('/api/about');
}

export async function fetchProjects() {
  return request('/api/portfolio');
}

export async function loginAdmin(credentials) {
  return request('/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  });
}
