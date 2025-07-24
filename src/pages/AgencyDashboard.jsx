import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { getAgencies }  from '../services/api';

export default function AgencyDashboard() {
  const { user } = useContext(AuthContext);
  const [agencies, setAgencies] = useState([]);
  useEffect(() => {
    getAgencies().then(setAgencies).catch(console.error);
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold">Agency Admin: {user.username}</h1>
      <p className="mt-4">Here are all your agencies:</p>
      <ul className="mt-2 space-y-2">
        {agencies.map(a => (
          <li key={a.id} className="p-4 bg-white rounded shadow">
            {a.name} (ID: {a.id})
          </li>
        ))}
      </ul>
    </div>
  );
}
