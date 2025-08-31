import { Request, Response } from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 이벤트 조회 (전체)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    console.error('이벤트 조회 오류:', err);
    res.status(500).json({ error: '이벤트 조회 실패' });
  }
};

// 이벤트 조회 (단건)
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 이벤트 생성
export const createEvent = async (req: Request, res: Response) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  const {
    title = '',
    description = '',
    date = null,
    location = '',
    tags = '',
  } = req.body;

  const image_pdf = req.file?.filename || '';

  try {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO events (title, description, date, location, tags, image_pdf) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, location, tags, image_pdf]
    );

    const insertId = result.insertId;
    const [[newEvent]] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM events WHERE id = ?',
      [insertId]
    );

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('이벤트 생성 오류:', err);
    res.status(500).json({ error: '이벤트 생성 실패' });
  }
};

// 이벤트 수정
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title = '',
    description = '',
    date = null,
    location = '',
    tags = '',
  } = req.body;

  const image_pdf = req.file?.filename || req.body.image_pdf || '';

  try {
    if (!title || !date) {
      return res.status(400).json({ message: '제목과 날짜는 필수입니다.' });
    }

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE events 
       SET title = ?, description = ?, date = ?, location = ?, tags = ?, image_pdf = ?
       WHERE id = ?`,
      [title, description, date, location, tags, image_pdf, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '해당 이벤트를 찾을 수 없습니다.' });
    }

    res.json({ message: '이벤트가 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('이벤트 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 이벤트 삭제
export const deleteEvent = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);

  try {
    const [[existing]] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );

    if (!existing) {
      return res.status(404).json({ error: '이벤트를 찾을 수 없습니다.' });
    }

    await db.execute('DELETE FROM events WHERE id = ?', [eventId]);

    res.json({ message: '이벤트가 삭제되었습니다.' });
  } catch (err) {
    console.error('이벤트 삭제 오류:', err);
    res.status(500).json({ error: '이벤트 삭제 실패' });
  }
};
