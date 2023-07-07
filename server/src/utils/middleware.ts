import { Request, Response, NextFunction } from 'express';
import { UserEntry } from '../types/types';

import logger from "./logger";
import User from "../models/user";
import jwt from "jsonwebtoken";

interface UserRequest extends Request {
  user?: UserEntry;
  token?: string;
}


export const requestLogger = (req: Request,
  _res: Response,
  next: NextFunction) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

export const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error: { message: string, name: string }, _req: Request, res: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

export const tokenExtractor = (req: UserRequest, _res: Response, next: NextFunction) => {
  // code that extracts the token
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
    console.log('tokenExtractor', req.token);
    next();
  }
};

export const userExtractor = async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.TOKEN_SECRECT || '');
      console.log('decodedToken', decodedToken);

      verifyDecodedToken(decodedToken);
      const user = await User.findOne({ email: decodedToken.email });

      req.user = user;
      next();
    } catch (err) {
      res.status(400).send('Invalid Token');
    }
  }
};

function verifyDecodedToken(data: unknown): asserts data is UserEntry {
  if (!(data instanceof Object)) throw new Error('Deocde token error. Token must be an object');
}

export const info = (params: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(params);
  }
};

export const error = (params: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(params);
  }
};

/*
export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  info,
  error,
};
*/