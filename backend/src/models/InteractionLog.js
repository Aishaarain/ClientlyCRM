import mongoose from 'mongoose';

const interactionLogSchema = new mongoose.Schema({
  workspaceId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true }, // ✅ replaces userId
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                      // ✅ who created
  clientId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type:            { type: String, enum: ['email', 'call', 'meeting', 'note'], required: true },
  direction:       { type: String, enum: ['inbound', 'outbound'] },
  content:         { type: String, required: true },
  sentiment:       { type: String, enum: ['positive', 'neutral', 'risk'], default: 'neutral' },
  sentimentReason: { type: String },
  loggedAt:        { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.InteractionLog || mongoose.model('InteractionLog', interactionLogSchema);