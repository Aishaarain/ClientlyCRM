import api from './axios.js';

export const clientApi = {
  getClients: (params = {}) => api.get('/clients', { params })
  .then((res) => res.data.clients ?? res.data.data ?? res.data),
  getClient: (id) => api.get(`/clients/${id}`).then((res) => res.data),
  createClient: (payload) => api.post('/clients', payload).then((res) => res.data),
  updateClient: (id, payload) => api.put(`/clients/${id}`, payload).then((res) => res.data),
  deleteClient: (id) => api.delete(`/clients/${id}`).then((res) => res.data),
  getClientById: (id) => api.get(`/clients/${id}`).then(r => r.data),
};
