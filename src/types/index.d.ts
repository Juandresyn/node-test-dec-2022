import 'express';

declare namespace Express {
  export interface Request {
    user?: any;
  }
}
