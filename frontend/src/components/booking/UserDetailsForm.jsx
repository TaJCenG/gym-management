import React, { useState } from 'react';

const UserDetailsForm = ({ userData, onChange }) => {
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone) => {
    // Accepts international format with optional '+', 8-15 digits
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Invalid phone number format (e.g., +1234567890)');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneBlur = (e) => {
    validatePhone(e.target.value);
  };

  const handleInputChange = (e) => {
    // Let the parent component update state
    onChange(e);
    // Optionally validate on change
    if (e.target.name === 'phone_number') {
      validatePhone(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          type="tel"
          name="phone_number"
          value={userData.phone_number || ''}
          onChange={handleInputChange}
          onBlur={handlePhoneBlur}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={userData.name || ''}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          name="age"
          value={userData.age || ''}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
    </div>
  );
};

export default UserDetailsForm;