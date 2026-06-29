import api from './axios.js';

export const interactionApi = {
  getInteractions: (params = {}) => api.get('/interactions', { params }).then((res) => res.data),
  createInteraction: (payload) => api.post('/interactions', payload).then((res) => res.data),
  deleteInteraction: (id) => api.delete(`/interactions/${id}`).then((res) => res.data),
};
