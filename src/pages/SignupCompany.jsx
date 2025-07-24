// src/pages/SignupCompany.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupCompany }     from '../services/api';       // ← use the new helper
import { AuthContext }       from '../auth/AuthContext';

export default function SignupCompany() {
  const { login } = useContext(AuthContext);
  const [form, setForm]   = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    password2: ''
  });
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const { firstName, lastName, email, password, password2 } = form;

    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !password2) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }
    const match = email.match(/^[^@]+@(.+)$/);
    if (!match) {
      setError('Please enter a valid email address.');
      return;
    }
    const domain = match[1];

    try {
      // 1️⃣ Create company + admin user
      await signupCompany({ firstName, lastName, email, password, domain });
      // 2️⃣ Auto-login so AuthContext.user is set
      await login(email, password);
      // 3️⃣ Move into email-verification step
      navigate('/onboard/verify');
    } catch (err) {
      // show the real failure message if provided
      setError(err.message || 'Failed to create company');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Company Account
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Company Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@yourcompany.com"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Create Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Verify Password</label>
            <input
              name="password2"
              type="password"
              value={form.password2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send Verification
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
