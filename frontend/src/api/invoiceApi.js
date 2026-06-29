import api, { API_URL } from './axios.js';

export const invoiceApi = {
  getInvoices: (params = {}) => api.get('/invoices', { params }).then((res) => res.data),
  createInvoice: (payload) => api.post('/invoices', payload).then((res) => res.data),
  updateInvoiceStatus: (id, status) => api.put(`/invoices/${id}/status`, { status }).then((res) => res.data),
  getInvoicePdfUrl: (id) => `${API_URL}/invoices/${id}/pdf`,
  deleteInvoice: (id) => api.delete(`/invoices/${id}`).then((res) => res.data),
  downloadInvoicePdf: async (id, invoiceNumber = 'invoice') => {
    const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  },
};
