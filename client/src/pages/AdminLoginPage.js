
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
      localStorage.setItem('adminToken', authToken);
      setSuccessMessage('Login successful! Redirecting...');
     
    } catch (apiError) {
      setError(apiError.message || 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-lg border border-white border-opacity-30 shadow-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
           
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required
             
              className="w-full bg-black bg-opacity-30 text-white border border-white border-opacity-20 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              
              className="w-full bg-black bg-opacity-30 text-white border border-white border-opacity-20 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        {error && (
          <p role="alert" className="text-red-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}
        {successMessage && <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>}
      </div>
    </div>
  );
}

export default AdminLoginPage;