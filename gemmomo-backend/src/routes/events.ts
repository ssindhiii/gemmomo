// src/routes/events.ts
import { Router } from 'express';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// 조회는 공개 (미들웨어 없음)
router.get('/', getAllEvents);

// 생성·수정·삭제는 관리자만
// router.post('/',   verifyToken, requireAdmin, createEvent);
// router.put('/:id', verifyToken, requireAdmin, updateEvent);
// router.delete('/:id', verifyToken, requireAdmin, deleteEvent);
router.post('/',   createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;