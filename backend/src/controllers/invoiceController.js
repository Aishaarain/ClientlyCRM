import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import { generateInvoicePDF } from '../services/pdfService.js';

// ─── All scoped by createdBy (consistent with Client/Project models) ─
const ownerFilter = (req) => ({ createdBy: req.user._id });

// GET /api/invoices
export const getInvoices = async (req, res, next) => {
  try {
    const filter = { ...ownerFilter(req) };
    if (req.query.clientId) filter.clientId = req.query.clientId;
    if (req.query.status)   filter.status   = req.query.status;

    const invoices = await Invoice.find(filter)
      .populate('clientId', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) { next(err); }
};

// POST /api/invoices
// POST /api/invoices
export const createInvoice = async (req, res, next) => {
  try {
    const { lineItems = [], tax = 0, userId, workspaceId, ...rest } = req.body;

    // Validate line items
    if (!lineItems.length) {
      return res.status(400).json({ message: "At least one line item is required" });
    }

    // Verify client belongs to this admin/user
    const client = await Client.findOne({
      _id: req.body.clientId,
      createdBy: req.user._id,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Verify project belongs to this admin/user if projectId exists
    if (req.body.projectId) {
      const Project = (await import("../models/Project.js")).default;

      const project = await Project.findOne({
        _id: req.body.projectId,
        createdBy: req.user._id,
      });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    // Add total inside EACH lineItem
    const updatedLineItems = lineItems.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return {
        ...item,
        quantity,
        rate,
        total: quantity * rate,
      };
    });

    const subtotal = updatedLineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Number(tax) || 0;

    const invoice = await Invoice.create({
      ...rest,
      lineItems: updatedLineItems,
      subtotal,
      tax: taxAmount,
      total: subtotal + taxAmount,
      createdBy: req.user._id,

      // Use workspaceId from logged-in user first, then body fallback
      workspaceId: req.user.workspaceId || workspaceId,
    });

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};
// GET /api/invoices/:id/pdf
export const getInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id:       req.params.id,
      ...ownerFilter(req),
    });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const client = await Client.findById(invoice.clientId);
    const buf = await generateInvoicePDF(invoice, client);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.send(buf);
  } catch (err) { next(err); }
};

// PUT /api/invoices/:id/status
export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, ...ownerFilter(req) },
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { next(err); }
};

// DELETE /api/invoices/:id
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id:       req.params.id,
      ...ownerFilter(req),
    });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) { next(err); }
};