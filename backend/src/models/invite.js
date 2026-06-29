import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  email:       { type: String, required: true, lowercase: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  invitedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token:       { type: String, required: true, unique: true },
  status:      { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  expiresAt:   { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Invite || mongoose.model('Invite', inviteSchema);