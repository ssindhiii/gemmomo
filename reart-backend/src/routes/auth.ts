import { Router } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 입력값 검증
  if (!username || !email || !password) {
    return res.status(400).json({ error: '아이디, 이메일, 비밀번호를 모두 입력해주세요.' });
  }

  try {
    // 중복 아이디 체크
    const [existing] = await db.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if ((existing as any[]).length > 0) {
      return res.status(409).json({ error: '이미 사용 중인 아이디 또는 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashed = await bcrypt.hash(password, 10);

    // 사용자 등록
    await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
});

export default router;
