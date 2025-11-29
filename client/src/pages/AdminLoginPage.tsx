import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { authToken } = await loginAdmin(formData);
      localStorage.setItem('adminToken', authToken);
      navigate('/admin/dashboard');
    } catch (apiError: any) { 
      if (apiError && apiError.message) {
        setError(apiError.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-lg border border-white border-opacity-30 shadow-lg p-8 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Admin Login</h1>
        
        <form className="space-y-6">
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
              className="w-full bg-black bg-opacity-30 text-white border border-white border-opacity-20 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              className="w-full bg-black bg-opacity-30 text-white border border-white border-opacity-20 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full py-3 px-4 rounded-md font-semibold text-white transition-all duration-300 ease-in-out
                       enabled:bg-gray-800 enabled:hover:bg-gray-900
                       disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-red-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLoginPage;