import api from './axios.js';

export const projectApi = {
  getProjects: (params = {}) => api.get('/projects', { params })
  .then((res) => res.data.projects ?? res.data.docs ?? res.data),
  getProjectById: (id) => api.get(`/projects/${id}`).then(r => r.data),
  getProject: (id) => api.get(`/projects/${id}`).then((res) => res.data),
  createProject: (payload) => api.post('/projects', payload).then((res) => res.data),
  updateProject: (id, payload) => api.put(`/projects/${id}`, payload).then((res) => res.data),
  deleteProject: (id) => api.delete(`/projects/${id}`).then((res) => res.data),
};


export const taskApi = {
  getTasks: () => api.get('/tasks').then((r) => r.data),
  createTask: (data) => api.post('/tasks', data).then((r) => r.data),
  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data),
  deleteTask: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
};