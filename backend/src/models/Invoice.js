import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity:    { type: Number, required: true },
  rate:        { type: Number, required: true },
  total:       { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  workspaceId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true }, // ✅ replaces userId
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                      // ✅ who created
  clientId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  projectId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  invoiceNumber:  { type: String },
  lineItems:      [lineItemSchema],
  subtotal:       { type: Number },
  tax:            { type: Number, default: 0 },
  total:          { type: Number },
  status:         { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  dueDate:        { type: Date },
  pdfPath:        { type: String },
  followUpSentAt: { type: Date },
  notes:          { type: String },
}, { timestamps: true });

// ✅ Per-workspace invoice numbering
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.models.Invoice.countDocuments({ workspaceId: this.workspaceId });
    this.invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);