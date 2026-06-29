import mongoose from 'mongoose';

const aiContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },

  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },

  type: {
    type: String,
    enum: ['proposal', 'follow_up', 'insight'],
    required: true
  },

  prompt: {
    type: String
  },

  content: {
    type: String
  },

  edited: {
    type: Boolean,
    default: false
  },

  editedContent: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('AIContent', aiContentSchema);