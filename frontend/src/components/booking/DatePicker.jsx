import React from 'react';

const CustomDatePicker = ({ selectedDate, onDateChange }) => {
  return (
    <div>
      <label>Select Date</label>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => onDateChange(new Date(e.target.value))}
      />
    </div>
  );
};

export default CustomDatePicker;