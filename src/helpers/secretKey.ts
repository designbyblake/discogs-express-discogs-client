import { Response } from 'express';

import dotenv from 'dotenv';
dotenv.config();

export const getKeySecret = (res: Response): KeySecret => {
  const KEY = process.env.DISCOGS_CONSUMER_KEY;
  const SECRET = process.env.DISCOGS_CONSUMER_SECRET;
  if (!KEY || !SECRET) {
    return res.status(500).json({ error: 'Consumer key/secret not set' });
  }
  return { KEY, SECRET };
};

type KeySecret =
  | { KEY: string; SECRET: string }
  | Response<any, Record<string, any>>;
