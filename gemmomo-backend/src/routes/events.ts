// src/routes/events.ts
import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// 조회는 공개 (미들웨어 없음)
router.get('/', getAllEvents);
router.get('/:id', getEventById);

router.post('/', upload.single('image_pdf'), createEvent);
router.put('/:id', upload.single('image_pdf'), updateEvent);
router.delete('/:id', deleteEvent);

// 생성·수정·삭제는 관리자만
// router.post('/',   verifyToken, requireAdmin, createEvent);
// router.put('/:id', verifyToken, requireAdmin, updateEvent);
// router.delete('/:id', verifyToken, requireAdmin, deleteEvent);
export default router;