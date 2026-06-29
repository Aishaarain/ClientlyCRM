import express from 'express';
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  sendInvite,
  acceptInvite,
  getWorkspaceInvites,
  verifyInvite
} from '../controllers/workspaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ─── Public invite routes (must be before /:workspaceId) ────────────
router.get('/invite/verify/:token',  verifyInvite);
router.post('/invite/accept/:token', acceptInvite);

// ─── Workspace CRUD ──────────────────────────────────────────────────
router.post('/',               protect, createWorkspace);
router.get('/',                protect, getMyWorkspaces);
router.get('/:workspaceId',    protect, getWorkspace);
router.put('/:workspaceId',    protect, updateWorkspace);
router.delete('/:workspaceId', protect, deleteWorkspace);

// ─── Invites (protected) ─────────────────────────────────────────────
router.post('/:workspaceId/invite',  protect, sendInvite);
router.get('/:workspaceId/invites',  protect, getWorkspaceInvites);

export default router;