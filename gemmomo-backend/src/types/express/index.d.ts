// types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        username: string;
        is_admin: boolean;
      };
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export {};