import InteractionLog from '../models/InteractionLog.js';
import Client from '../models/Client.js';
import { tagSentiment } from '../services/groqService.js';

// Admin sees all workspace logs, freelancer sees only own
const workspaceFilter = (req) => ({
  workspaceId: req.user.workspaceId,
  ...(req.user.role === 'freelancer' ? { createdBy: req.user.id } : {}),
});

// GET /api/interactions
export const getInteractions = async (req, res, next) => {
  try {
    const filter = { ...workspaceFilter(req) }; // ✅ workspace scoped
    if (req.query.clientId)  filter.clientId  = req.query.clientId;
    if (req.query.type)      filter.type      = req.query.type;
    if (req.query.sentiment) filter.sentiment = req.query.sentiment;

    const logs = await InteractionLog.find(filter)
      .populate('clientId', 'name email company')
      .sort({ loggedAt: -1 });

    res.json(logs);
  } catch (err) { next(err); }
};

// GET /api/interactions/:id
export const getInteraction = async (req, res, next) => {
  try {
    const log = await InteractionLog.findOne({
      _id: req.params.id,
      ...workspaceFilter(req), // ✅
    }).populate('clientId', 'name email company');

    if (!log) return res.status(404).json({ message: 'Interaction not found' });
    res.json(log);
  } catch (err) { next(err); }
};

// POST /api/interactions
export const createInteraction = async (req, res, next) => {
  try {
    // ✅ Verify client belongs to same workspace
    const client = await Client.findOne({
      _id:         req.body.clientId,
      workspaceId: req.user.workspaceId,
      isDeleted:   false,
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const { userId, workspaceId, ...safeBody } = req.body; // ✅ strip ids

    const { sentiment, reason } = await tagSentiment(safeBody.content);

    const log = await InteractionLog.create({
      ...safeBody,
      sentiment,
      sentimentReason: reason,
      workspaceId:     req.user.workspaceId, // ✅ force workspace
      createdBy:       req.user.id,          // ✅ track who created
    });

    res.status(201).json(log);
  } catch (err) { next(err); }
};

// PUT /api/interactions/:id
export const updateInteraction = async (req, res, next) => {
  try {
    const { userId, workspaceId, ...safeBody } = req.body; // ✅ strip ids

    // ✅ Re-run sentiment if content changed
    if (safeBody.content) {
      const { sentiment, reason } = await tagSentiment(safeBody.content);
      safeBody.sentiment       = sentiment;
      safeBody.sentimentReason = reason;
    }

    const log = await InteractionLog.findOneAndUpdate(
      { _id: req.params.id, ...workspaceFilter(req) }, // ✅
      safeBody,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email company');

    if (!log) return res.status(404).json({ message: 'Interaction not found' });
    res.json(log);
  } catch (err) { next(err); }
};

// DELETE /api/interactions/:id
export const deleteInteraction = async (req, res, next) => {
  try {
    const log = await InteractionLog.findOneAndDelete({
      _id: req.params.id,
      ...workspaceFilter(req), // ✅
    });

    if (!log) return res.status(404).json({ message: 'Interaction not found' });
    res.json({ message: 'Interaction deleted' });
  } catch (err) { next(err); }
};