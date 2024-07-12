import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user: JwtPayload | null;
      file?: {
        buffer: Buffer;
        mimetype: string;
      };
    }
  }
}
