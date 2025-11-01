// Allows the admin to authenticate against the backend API.
import React, { useState } from 'react';
import { loginAdmin } from '../services/api';

function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      const { authToken } = await loginAdmin(formData);
      localStorage.setItem('adminToken', authToken); // Persist the token so later requests can reuse it.
      setSuccessMessage('Login successful! Token stored for future requests.');
    } catch (apiError) {
      setError(apiError.message || 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Admin Login</h1>
      <p>Use your admin credentials to manage portfolio content.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </section>
  );
}

export default AdminLoginPage;
