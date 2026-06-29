import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateProposal, generateFollowUp, queryInsights, getAIContent, updateAIContent } from '../controllers/aiController.js';

const router = express.Router();
router.use(protect);
router.post('/proposal', generateProposal);
router.post('/follow-up', generateFollowUp);
router.post('/insight', queryInsights);
router.get('/content', getAIContent);
router.put('/content/:id', updateAIContent);
export default router;