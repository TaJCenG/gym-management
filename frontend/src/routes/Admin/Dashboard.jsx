import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backgroundStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '2rem',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(5, 5, 25, 0.9)', // was 0.9
    borderRadius: '212px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(10,0,0,0.2)',
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={backgroundStyle}><div style={overlayStyle}>Loading dashboard...</div></div>;
  if (error) return <div style={backgroundStyle}><div style={overlayStyle} className="text-red-500">{error}</div></div>;
  if (!stats) return <div style={backgroundStyle}><div style={overlayStyle}>No data available</div></div>;

  const classData = stats.popular_classes.map((item, index) => ({
    name: `Class ${item.class_id}`,
    bookings: item.count
  }));

  const trainerData = stats.trainer_utilization.map((item, index) => ({
    name: `Trainer ${item.trainer_id}`,
    sessions: item.count
  }));

  const peakHourData = stats.peak_hours.map((item) => ({
    hour: `${item.hour}:00`,
    bookings: item.count
  }));

  return (
      <div style={backgroundStyle}>
        <div style={overlayStyle}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Link to="/admin/trainers" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Manage Trainers
            </Link>
            <Link to="/admin/gym_class" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-2">
              Manage Classes
            </Link>
            <Link to="/admin/memberships"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-2">
              View Memberships
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Total Appointments</h3>
              <p className="text-2xl font-bold">{stats.total_appointments}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Today's Appointments</h3>
              <p className="text-2xl font-bold">{stats.today_appointments}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Active Members</h3>
              <p className="text-2xl font-bold">{stats.active_members}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-gray-500 text-sm">Trial Members</h3>
              <p className="text-2xl font-bold">{stats.trial_members}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Classes */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Popular Classes</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="bookings" fill="#8884d8"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Trainer Utilization */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Trainer Utilization</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trainerData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="sessions" fill="#82ca9d"/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Peak Hours */}
            <div className="bg-white p-4 rounded shadow lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Peak Hours</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakHourData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="hour"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;