import express from 'express';
import { updateBalance, updateIncome, getProfile } from '../controllers/users';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/balance', protect, updateBalance);
router.put('/income', protect, updateIncome);

export default router;