import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // 선택적 로그아웃 처리

export default router;