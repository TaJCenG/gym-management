import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backgroundStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '2rem',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(5, 5, 25, 0.9)',
    borderRadius: '212px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(10,0,0,0.2)',
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await api.get('/memberships/admin');
      setMemberships(response.data);
    } catch (err) {
      setError('Failed to load memberships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={backgroundStyle}><div style={overlayStyle}>Loading memberships...</div></div>;

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Membership Management</h1>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {memberships.length === 0 ? (
          <p className="text-white">No memberships found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">User Name</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Start Date</th>
                  <th className="py-3 px-6 text-left">End Date</th>
                  <th className="py-3 px-6 text-left">Active</th>
                  <th className="py-3 px-6 text-left">Payment Status</th>
                 </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {memberships.map((m) => (
                  <tr key={m.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{m.id}</td>
                    <td className="py-3 px-6 text-left">{m.user_name || `User ${m.user_id}`}</td>
                    <td className="py-3 px-6 text-left">{m.type}</td>
                    <td className="py-3 px-6 text-left">{m.start_date}</td>
                    <td className="py-3 px-6 text-left">{m.end_date}</td>
                    <td className="py-3 px-6 text-left">{m.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-3 px-6 text-left">{m.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMemberships;