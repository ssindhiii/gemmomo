import { Request, Response } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');

// 회원가입
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.warn('입력값 누락:', { username, email, password });
    return res.status(400).json({ error: '아이디, 이메일, 비밀번호를 모두 입력해주세요.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: '올바른 이메일 형식이 아닙니다.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' });
  }

  try {
    const [existing] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      console.warn('중복 사용자 존재:', existing);
      return res.status(409).json({ error: '이미 사용 중인 아이디 또는 이메일입니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
};

// 로그인
export const loginUser = async (req: Request, res: Response) => {
  console.log('🔐 로그인 요청 도착:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(404).json({ error: '존재하지 않는 아이디입니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // ✅ 관리자 여부를 boolean으로 변환
    const isAdmin = user.is_admin === 1;

    // ✅ 토큰 생성 시 관리자 정보 포함
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: isAdmin,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ 사용자 정보도 함께 응답 (선택)
    res.status(200).json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: isAdmin,
      },
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
};

// 로그아웃 (JWT 기반)
export const logoutUser = (req: Request, res: Response) => {
  // 클라이언트에서 토큰 삭제만 해도 로그아웃 처리됨
  res.status(200).json({ message: '로그아웃 완료' });
};
