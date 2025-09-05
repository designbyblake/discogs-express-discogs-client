import { Response } from 'express';

export const setCookies = (
  res: Response,
  name: string,
  value: string | null,
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: false, // use only over HTTPS
    sameSite: 'lax', // or 'strict'
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months in milliseconds
  });
};
