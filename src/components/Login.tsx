import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ForgotPassword from './ForgotPassword';

interface LoginProps {
  onSuccess: () => void;
  onSignupClick: () => void;
}

export default function Login({ onSuccess, onSignupClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password, rememberMe);
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
      console.error('Login error:', err);
    }

    setLoading(false);
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  }

  if (showForgotPassword) {
    return <ForgotPassword onCancel={handleBackToLogin} onSuccess={handleBackToLogin} />;
  }

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-300">
      <div className="flex items-center justify-center mb-6">
        <img src="/logo.png" alt="Hukie Logo" className="h-12 w-12 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-6">
        <p className="text-sm text-blue-800 text-center">
          Demo credentials: <span className="font-bold">test@test.com</span> / <span className="font-bold">test123</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-bold text-gray-800">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-teal-700 hover:text-teal-900 font-bold"
            >
              Forgot Password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-800">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-4 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 transition-colors mt-4 shadow-lg text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-700">
          Don't have an account?{' '}
          <button
            onClick={onSignupClick}
            className="text-teal-700 hover:text-teal-900 font-bold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
