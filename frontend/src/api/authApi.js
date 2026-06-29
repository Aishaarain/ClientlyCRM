import api from './axios.js';

// export const authApi = {
//   register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
//   login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
// };

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((res) => {
    console.log('LOGIN RESPONSE:', res.data); // ← add this
    return res.data;
  }),
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
};

