import { Request, Response } from 'express';
import { db } from '../db';
import { JwtPayload } from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: JwtPayload }).user?.id;

  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
    return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('사용자 조회 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: JwtPayload }).user?.id;
  const { username, email } = req.body;

  try {
    await db.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);
    res.json({ message: '사용자 정보가 수정되었습니다.' });
  } catch (err) {
    console.error('사용자 수정 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
};

