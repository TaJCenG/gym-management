import React from 'react';

const TimeSlotPicker = ({ selectedTime, onTimeChange }) => {
  // selectedTime is a string "HH:MM"
  const [hour, minute] = selectedTime ? selectedTime.split(':') : ['09', '00'];

  const hours = Array.from({ length: 12 }, (_, i) => (i + 8).toString().padStart(2, '0')); // 8 AM to 7 PM
  const minutes = ['00', '15', '30', '45']; // 15-minute slots

  const handleHourChange = (e) => {
    onTimeChange(`${e.target.value}:${minute}`);
  };

  const handleMinuteChange = (e) => {
    onTimeChange(`${hour}:${e.target.value}`);
  };

  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Hour</label>
        <select
          value={hour}
          onChange={handleHourChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
        <select
          value={minute}
          onChange={handleMinuteChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeSlotPicker;