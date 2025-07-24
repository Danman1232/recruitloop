import React, { useState, useContext } from 'react';
import { useNavigate, Link }          from 'react-router-dom';
import AuthContext                    from '../auth/AuthContext';

export default function Login() {
  const [identifier, setIdentifier]   = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const { login }                     = useContext(AuthContext);
  const navigate                      = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const me = await login(identifier, password);

      // route based on role
      if (me.role === 'company') {
        navigate('/dashboard', { replace: true });
      } else if (me.role === 'agency_admin') {
        navigate('/agency', { replace: true });
      } else if (me.role === 'agency_recruiter') {
        navigate('/agency/jobs', { replace: true });
      } else if (me.role === 'looper') {
        navigate('/jobs', { replace: true });
      } else {
        navigate('/unauthorized', { replace: true });
      }

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-2 font-medium">Email or Username</label>
        <input
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="you@company.com"
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-6"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
