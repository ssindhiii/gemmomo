import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users');
    res.json(rows);
  }catch (err) {
    if (err instanceof Error) {
        console.error('❌ 회원 조회 실패:', err.message);
    } else {
        console.error('❌ 알 수 없는 오류:', err);
    }
    res.status(500).json({ error: '회원 조회 실패' });
    }
});

export default router;