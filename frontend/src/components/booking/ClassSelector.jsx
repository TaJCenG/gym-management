import React, { useState, useEffect } from 'react';
import { getClasses } from '../../services/class';

const ClassSelector = ({ onSelect, selectedClassId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return <div>Loading classes...</div>;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Class
      </label>
      <select
        value={selectedClassId || ''}
        onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value) : null)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Choose a class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name} (Trainer: {cls.trainer_id}) - Capacity: {cls.capacity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassSelector;