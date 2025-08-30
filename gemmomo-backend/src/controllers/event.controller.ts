// src/controllers/events.controller.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { JwtPayload } from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface EventRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  date: Date;
  created_by: number;
}

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute<EventRow[]>('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    console.error('이벤트 조회 오류:', err);
    res.status(500).json({ error: '이벤트 조회 실패' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: JwtPayload }).user?.id;
  const { title, description, date } = req.body;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO events (title, description, date, created_by) VALUES (?, ?, ?, ?)',
      [title, description, date, userId]
    );

    const insertId = result.insertId;
    const [[newEvent]] = await db.execute<EventRow[]>(
      'SELECT * FROM events WHERE id = ?',
      [insertId]
    );

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('이벤트 생성 오류:', err);
    res.status(500).json({ error: '이벤트 생성 실패' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: JwtPayload }).user?.id;
  const eventId = Number(req.params.id);
  const { title, description, date } = req.body;

  try {
    // 기존 이벤트 조회
    const [[existing]] = await db.execute<EventRow[]>(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    if (!existing) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }

    if (existing.created_by !== userId && !(req as any).user?.is_admin) {
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    await db.execute(
      'UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?',
      [title, description, date, eventId]
    );

    const [[updatedEvent]] = await db.execute<EventRow[]>(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    res.json(updatedEvent);
  } catch (err) {
    console.error('이벤트 수정 오류:', err);
    res.status(500).json({ error: '이벤트 수정 실패' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: JwtPayload }).user?.id;
  const eventId = Number(req.params.id);

  try {
    const [[existing]] = await db.execute<EventRow[]>(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    if (!existing) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }

    if (existing.created_by !== userId && !(req as any).user?.is_admin) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' });
    }

    await db.execute('DELETE FROM events WHERE id = ?', [eventId]);
    res.json({ message: '이벤트가 삭제되었습니다.' });
  } catch (err) {
    console.error('이벤트 삭제 오류:', err);
    res.status(500).json({ error: '이벤트 삭제 실패' });
  }
};
