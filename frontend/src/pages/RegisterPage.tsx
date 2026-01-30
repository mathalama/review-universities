import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { AuthResponse } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ALLOWED_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "icloud.com", "protonmail.com", "proton.me",
    "mail.ru", "yandex.ru", "yandex.com", "ya.ru", 
    "rambler.ru", "bk.ru", "inbox.ru", "list.ru", "internet.ru",
    "ukr.net", "i.ua"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side Domain Validation
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
        setError('Please use a common email provider (Gmail, Yandex, Mail.ru, etc.)');
        return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Optimistic UI delay
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
      const request = api.post<AuthResponse>('/auth/register', { firstname, lastname, email, password });
      
      await Promise.all([minDelay, request]);
      
      // Redirect to verification pending page on success
      navigate('/verification-pending', { state: { email } });
      
    } catch (err: any) {
        if (err.response && err.response.data) {
            const data = err.response.data;
            
            // Handle HTML errors (e.g. 404/500 Proxy errors)
            if (typeof data === 'string' && data.trim().startsWith('<')) {
                console.error("Received HTML error response:", data);
                setError('Unable to reach the server. Please check your connection or try again later.');
                return;
            }

            if (typeof data === 'string') {
                setError(data);
                if (data.includes("verification email has already been sent")) {
                    // Redirect to verification page if already sent
                    navigate('/verification-pending', { state: { email } });
                }
            } else if (data.error) {
                setError(data.error);
                if (data.error.includes("verification email has already been sent")) {
                     navigate('/verification-pending', { state: { email } });
                }
            } else if (typeof data === 'object') {
                const firstError = Object.values(data)[0] as string;
                setError(firstError);
            } else {
                setError('Registration failed. Please check your data.');
            }
        } else {
            setError('Could not connect to the server.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
             {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

           <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              <div className="mt-6 flex justify-center text-sm">
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Already have an account? Sign in
                  </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;