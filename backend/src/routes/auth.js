import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.js';
import Workspace from '../models/workSpace.js';
import Invite from '../models/invite.js';
import { protect } from '../middleware/auth.js';
import { sendInviteEmail } from '../utils/Email.js';

const router = express.Router();

const createToken = (user) => jwt.sign(
  {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    workspaceId: user.workspaceId,
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const getFrontendUrl = () => process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';

// Register — creates admin + workspace
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    const workspace = await Workspace.create({
      name: `${name}'s Workspace`,
      ownerId: user._id,
    });

    user.workspaceId = workspace._id;
    await user.save();

    const token = createToken(user);

    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Send invite — admin only, using system email with replyTo
router.post('/invite/send', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can invite' });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await User.findOne({ email, workspaceId: req.user.workspaceId });
    if (existing) return res.status(400).json({ message: 'User already in your workspace' });

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await Invite.findOneAndUpdate(
      { email, workspaceId: req.user.workspaceId },
      {
        token: inviteToken,
        expiresAt,
        status: 'pending',
        invitedBy: req.user.id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const inviteLink = `${getFrontendUrl()}/accept-invite?token=${inviteToken}`;

   await sendInviteEmail({
  adminId: req.user.id,
  toEmail: email,
  inviteLink,
});
    res.json({ message: `Invitation sent to ${email}` });
  } catch (err) {
    if (err.message?.includes('Email service is not configured')) {
      return res.status(500).json({ message: err.message });
    }

    next(err);
  }
});

// Accept invite — freelancer sets name + password
router.post('/invite/accept', async (req, res, next) => {
  try {
    const { token, name, password } = req.body;

    if (!token || !name || !password) {
      return res.status(400).json({ message: 'Token, name, and password are required' });
    }

    const invite = await Invite.findOne({ token, status: 'pending' });
    if (!invite) return res.status(400).json({ message: 'Invalid or already used invite link' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invite link has expired' });

    const existing = await User.findOne({ email: invite.email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: 'freelancer',
      workspaceId: invite.workspaceId,
      status: 'active',
    });

    invite.status = 'accepted';
    await invite.save();

    res.status(201).json({ message: 'Account created! Please login.' });
  } catch (err) {
    next(err);
  }
});

// Get invite info so frontend can show email on accept page
router.get('/invite/:token', async (req, res, next) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token, status: 'pending' });

    if (!invite) return res.status(404).json({ message: 'Invalid or expired invite' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invite expired' });

    res.json({ email: invite.email });
  } catch (err) {
    next(err);
  }
});

export default router;
