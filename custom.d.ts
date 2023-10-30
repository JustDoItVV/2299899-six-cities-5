import { TokenPayload } from './src/shared/models/auth/index.ts';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}
