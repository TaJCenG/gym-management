import api from './api';

export const checkAvailability = async (data) => {
  const response = await api.post('/appointments/check-availability', data);
  return response.data;
};

export const createBooking = async (data) => {
  const response = await api.post('/appointments/', data);
  return response.data;
};