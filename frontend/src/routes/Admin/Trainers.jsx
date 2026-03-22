import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
    profile_pic: '',
    is_active: true
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
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/admin/trainers');
      setTrainers(response.data);
    } catch (err) {
      setError('Failed to load trainers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setFormData({ name: '', specialization: '', bio: '', profile_pic: '', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      specialization: trainer.specialization || '',
      bio: trainer.bio || '',
      profile_pic: trainer.profile_pic || '',
      is_active: trainer.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await api.put(`/admin/trainers/${editingTrainer.id}`, formData);
      } else {
        await api.post('/admin/trainers', formData);
      }
      fetchTrainers();
      setShowModal(false);
    } catch (err) {
      setError('Failed to save trainer');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      await api.delete(`/admin/trainers/${id}`);
      fetchTrainers();
    } catch (err) {
      setError('Failed to delete trainer');
      console.error(err);
    }
  };

  if (loading) return <div style={backgroundStyle}><div style={overlayStyle}>Loading trainers...</div></div>;

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Trainer Management</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Trainer
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {trainers.length === 0 ? (
          <p className="text-white">No trainers found. Add one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainers.map((trainer) => (
              <div key={trainer.id} className={`bg-white p-4 rounded shadow ${!trainer.is_active ? 'opacity-50' : ''}`}>
                {!trainer.is_active && <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mb-2">Inactive</span>}
                {/* Trainer Profile Image */}
                {trainer.profile_pic && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={trainer.profile_pic}
                      alt={trainer.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-center">{trainer.name}</h3>
                <p className="text-gray-600 text-center">{trainer.specialization || 'No specialization'}</p>
                <p className="text-sm mt-2 text-center">{trainer.bio || 'No bio'}</p>
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => openEditModal(trainer)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.id)}
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
              <h2 className="text-2xl mb-4">{editingTrainer ? 'Edit Trainer' : 'Add Trainer'}</h2>
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
                  <label className="block mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Profile Picture URL</label>
                  <input
                    type="url"
                    name="profile_pic"
                    value={formData.profile_pic}
                    onChange={handleInputChange}
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

export default AdminTrainers;