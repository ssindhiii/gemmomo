import express from 'express';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth';
import testRouter from './routes/test';
import userRouter from './routes/user';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/test', testRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});