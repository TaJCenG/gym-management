import api from './api';

export const getClasses = async () => {
  const response = await api.get('/classes/');
  return response.data;
};

export const getClass = async (id) => {
  const response = await api.get(`/classes/${id}`);
  return response.data;
};