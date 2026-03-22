import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getTrainers } from '../../services/trainer';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainer_id: '',
    capacity: '',
    duration_minutes: '',
    start_time: '09:00',
    end_time: '10:00',
    days_of_week: '',
    is_active: true,
  });

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
    fetchClasses();
    fetchTrainers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    try {
      const data = await getTrainers();
      setTrainers(data);
    } catch (err) {
      console.error('Failed to fetch trainers', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const openAddModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      trainer_id: '',
      capacity: '',
      duration_minutes: '',
      start_time: '09:00',
      end_time: '10:00',
      days_of_week: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description || '',
      trainer_id: cls.trainer_id,
      capacity: cls.capacity,
      duration_minutes: cls.duration_minutes,
      start_time: cls.start_time.slice(0, 5),
      end_time: cls.end_time.slice(0, 5),
      days_of_week: cls.days_of_week || '',
      is_active: cls.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        trainer_id: parseInt(formData.trainer_id),
        capacity: parseInt(formData.capacity),
        duration_minutes: parseInt(formData.duration_minutes),
      };
      if (editingClass) {
        await api.put(`/admin/classes/${editingClass.id}`, payload);
      } else {
        await api.post('/admin/classes', payload);
      }
      fetchClasses();
      setShowModal(false);
    } catch (err) {
      setError('Failed to save class');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await api.delete(`/admin/classes/${id}`);
      fetchClasses();
    } catch (err) {
      setError('Failed to delete class');
      console.error(err);
    }
  };

  if (loading)
    return (
      <div style={backgroundStyle}>
        <div style={overlayStyle}>Loading classes...</div>
      </div>
    );

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Class Management</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Class
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {classes.length === 0 ? (
          <p className="text-white">No classes found. Add one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`bg-white p-4 rounded shadow ${!cls.is_active ? 'opacity-50' : ''}`}
              >
                {!cls.is_active && (
                  <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-2">
                    Inactive
                  </span>
                )}
                <h3 className="text-xl font-semibold">{cls.name}</h3>
                <p className="text-gray-600">{cls.description || 'No description'}</p>
                <p className="text-sm mt-1">
                  <strong>Trainer:</strong>{' '}
                  {trainers.find((t) => t.id === cls.trainer_id)?.name || `ID ${cls.trainer_id}`}
                </p>
                <p className="text-sm">
                  <strong>Capacity:</strong> {cls.capacity}
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong> {cls.duration_minutes} min
                </p>
                <p className="text-sm">
                  <strong>Time:</strong> {cls.start_time.slice(0, 5)} – {cls.end_time.slice(0, 5)}
                </p>
                <p className="text-sm">
                  <strong>Days:</strong> {cls.days_of_week || 'Not set'}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(cls)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl mb-4">{editingClass ? 'Edit Class' : 'Add Class'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Trainer *</label>
                  <select
                    name="trainer_id"
                    value={formData.trainer_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select a trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.id} value={trainer.id}>
                        {trainer.name} - {trainer.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">Start Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">End Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Days of week (e.g., Mon,Wed,Fri)</label>
                  <input
                    type="text"
                    name="days_of_week"
                    value={formData.days_of_week}
                    onChange={handleInputChange}
                    placeholder="Mon,Wed,Fri"
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClasses;