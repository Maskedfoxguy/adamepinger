const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request(path, options = {}) {
  const response = await fetch(path, options);

  if (!response.ok) {
    let message = 'Request failed.';

    try {
      const body = await response.json();
      if (body && body.message) {
        message = body.message;
      } else if (body && Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors.map((error) => error.message).join(' ');
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

function createAdminHeaders() {
  const adminToken = localStorage.getItem('adminToken');

  return {
    ...JSON_HEADERS,
    Authorization: 'Bearer ' + adminToken,
  };
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

export async function fetchAdminAccount() {
  return request('/api/admin/account', {
    headers: createAdminHeaders(),
  });
}

export async function updateAdminAccount(accountData) {
  return request('/api/admin/account', {
    method: 'PUT',
    headers: createAdminHeaders(),
    body: JSON.stringify(accountData),
  });
}

export async function createAdminProject(projectData) {
  return request('/api/admin/portfolio', {
    method: 'POST',
    headers: createAdminHeaders(),
    body: JSON.stringify(projectData),
  });
}