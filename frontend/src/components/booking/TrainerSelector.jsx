import React, { useState, useEffect } from 'react';
import { getTrainers } from '../../services/trainer';

const TrainerSelector = ({ selectedTrainerId, onSelect }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getTrainers();
        setTrainers(data);
      } catch (error) {
        console.error('Failed to fetch trainers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  if (loading) return <div>Loading trainers...</div>;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Trainer
      </label>
      <select
        value={selectedTrainerId || ''}
        onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Choose a trainer</option>
        {trainers.map((trainer) => (
          <option key={trainer.id} value={trainer.id}>
            {trainer.name} - {trainer.specialization}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TrainerSelector;