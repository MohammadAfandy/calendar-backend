import { IToken } from '../../interfaces/token';

declare global {
  namespace Express {
    interface Request {
        token: IToken
    }
  }
}
