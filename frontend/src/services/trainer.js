import api from './api';

export const getTrainers = async () => {
  const response = await api.get('/trainers/');
  return response.data;
};

export const getTrainer = async (id) => {
  const response = await api.get(`/trainers/${id}`);
  return response.data;
};