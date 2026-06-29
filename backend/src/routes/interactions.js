import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getInteractions,
  getInteraction,
  createInteraction,
  updateInteraction,
  deleteInteraction,
} from '../controllers/InteractionController.js';

const router = express.Router();
router.use(protect);

router.route('/').get(getInteractions).post(createInteraction);
router.route('/:id').get(getInteraction).put(updateInteraction).delete(deleteInteraction);

export default router;