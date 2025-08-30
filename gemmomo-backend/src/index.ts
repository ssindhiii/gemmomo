import express from 'express';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import eventsRouter from './routes/events';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('백엔드 서버가 정상적으로 작동 중입니다!');
});
app.use('/api/auth', (req, res, next) => {
  console.log('✅ /api/auth 경로 접근됨');
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// 이벤트 라우터 등록
app.use('/api/events', eventsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});