import crypto from 'crypto';
import Workspace from '../models/workSpace.js';
import Invite from '../models/invite.js';
import User from '../models/user.js';
import { sendInviteEmail } from "../utils/Email.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://cliently-crm-freelance.vercel.app";
// ─── Create Workspace ───────────────────────────────────────────────
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: 'Workspace name is required' });

    const workspace = await Workspace.create({ name, ownerId: req.user._id });

// ← add this
await User.findByIdAndUpdate(req.user._id, { workspaceId: workspace._id });

    res.status(201).json({ message: 'Workspace created', workspace });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get My Workspaces ──────────────────────────────────────────────
export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ ownerId: req.user._id });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Single Workspace ───────────────────────────────────────────
export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update Workspace ───────────────────────────────────────────────
export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    workspace.name = req.body.name || workspace.name;
    await workspace.save();

    res.json({ message: 'Workspace updated', workspace });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Delete Workspace ───────────────────────────────────────────────
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await workspace.deleteOne();
    await Invite.deleteMany({ workspaceId: workspace._id });

    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Send Invite ────────────────────────────────────────────────────
export const sendInvite = async (req, res) => {
  try {
    const { email } = req.body;
    const { workspaceId } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the workspace owner can send invites' });
    }

    const existingUser = await User.findOne({ email, workspaceId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already in this workspace' });
    }

    // Check for existing pending invite
    const existing = await Invite.findOne({ email, workspaceId, status: 'pending' });

    const token = existing?.token || crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    // ✅ Try sending email FIRST before touching the DB
    try {
      await sendInviteEmail({
        to: email,
        invitedBy: req.user.email,
        inviteLink,
        workspaceName: workspace.name,
      });
    } catch (emailErr) {
      console.error('❌ Email failed:', emailErr.message);
      return res.status(500).json({
        message: `Failed to send invite email: ${emailErr.message}`,
      });
    }

    // ✅ Only save/update DB after email succeeds
    if (existing) {
      // Resend — refresh token and expiry
      existing.token     = token;
      existing.expiresAt = expiresAt;
      await existing.save();
    } else {
      await Invite.create({
        email,
        workspaceId,
        invitedBy: req.user._id,
        token,
        expiresAt,
      });
    }

    res.status(201).json({ message: 'Invite sent successfully' });
  } catch (err) {
    console.error('sendInvite error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
// ─── Accept Invite (freelancer registers via invite link) ───────────
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return res.status(404).json({ message: 'Invalid or already used invite' });

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invite has expired' });
    }

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invite.email });
    if (existingUser) return res.status(400).json({ message: 'User already registered with this email' });

    // Create the freelancer user
    const user = await User.create({
      name,
      email: invite.email,
      password,
      role: 'freelancer',
      workspaceId: invite.workspaceId,
    });

    // Mark invite as accepted
    invite.status = 'accepted';
    await invite.save();

    res.status(201).json({
      message: 'Account created successfully',
      workspaceId: invite.workspaceId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Get Workspace Invites ──────────────────────────────────────────
export const getWorkspaceInvites = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    if (workspace.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const invites = await Invite.find({ workspaceId }).populate('invitedBy', 'name email');

    res.json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Verify Invite Token (public) ───────────────────────────────────
export const verifyInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token, status: 'pending' });
    console.log('invite found:', invite);
    if (!invite) return res.status(404).json({ message: 'Invalid or already used invite' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invite has expired' });

    res.json({ email: invite.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


