import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile
} from '../controllers/user.controller';

const router = Router();

// 내 정보 조회
router.get('/me', verifyToken, getUserProfile);

// 내 정보 수정
router.put('/me', verifyToken, updateUserProfile);

export default router;