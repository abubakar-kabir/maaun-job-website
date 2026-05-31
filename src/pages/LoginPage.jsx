import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Maaunlogo.png';

const EMPLOYER_PIN = '1246';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const resetMode = () => {
    setMode(null);
    setPin('');
    setError('');
  };

  const handleEmployee = () => {
    setError('');
    login('employee');
    navigate('/jobs', { replace: true });
  };

  const handleEmployerSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (pin !== EMPLOYER_PIN) {
      setError('Invalid PIN. Employer access requires the correct PIN.');
      return;
    }
    login('employer');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Maaun jobs" className="w-14 h-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 text-center">Maaun Group Jobs</h1>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Sign in to continue. Choose how you will use the site.
          </p>
        </div>

        {!mode && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setMode('employee')}
              className="w-full rounded-lg border-2 border-blue-600 bg-blue-50 px-4 py-4 text-left transition hover:bg-blue-100"
            >
              <span className="block font-semibold text-gray-900">I am an employee</span>
              <span className="block text-sm text-gray-600 mt-1">
                Browse job listings and get in touch with us.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('employer')}
              className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-4 text-left transition hover:bg-gray-100"
            >
              <span className="block font-semibold text-gray-900">I am an employer</span>
              <span className="block text-sm text-gray-600 mt-1">
                Full access including posting and editing jobs.
              </span>
            </button>
          </div>
        )}

        {mode === 'employee' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You will have access to job listings, job details, and the contact page.
            </p>
            <button
              type="button"
              onClick={handleEmployee}
              className="w-full rounded-lg bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700"
            >
              Continue as employee
            </button>
            <button
              type="button"
              onClick={resetMode}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
          </div>
        )}

        {mode === 'employer' && (
          <form onSubmit={handleEmployerSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Employer PIN</span>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter PIN"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 text-white font-semibold py-3 hover:bg-gray-800"
            >
              Verify and continue
            </button>
            <button
              type="button"
              onClick={resetMode}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
