import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();
router.use(protect);

// GET /api/team/members — admin sees all workspace members
router.get('/members', async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admin only' });

    const members = await User.find({ workspaceId: req.user.workspaceId })
      .select('name email role status createdAt')
      .sort({ createdAt: 1 });

    res.json(members);
  } catch (err) { next(err); }
});

export default router;