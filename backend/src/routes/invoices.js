import express from 'express';
import { protect } from '../middleware/auth.js';
import { getInvoices, createInvoice, getInvoicePDF, updateInvoiceStatus, deleteInvoice } from '../controllers/invoiceController.js';

const router = express.Router();
router.use(protect);


router.delete('/:id', deleteInvoice); 
router.get('/',           getInvoices);
router.post('/',          createInvoice);
router.get('/:id/pdf',    getInvoicePDF);
router.put('/:id/status', updateInvoiceStatus);

export default router;