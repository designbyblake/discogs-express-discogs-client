import { DiscogsOAuth, DiscogsClient } from '@lionralfs/discogs-client';
import { Response, Request } from 'express';

import { getKeySecret } from './secretKey';

export const discogsOAuth = (res: Response) => {
  const { KEY, SECRET } = getKeySecret(res) as {
    KEY: string;
    SECRET: string;
  };

  return new DiscogsOAuth(KEY, SECRET);
};

export const authorizedDiscogsClient = (
  res: Response,
  req: Request,
  accessToken?: string,
  accessTokenSecret?: string,
) => {
  const { KEY, SECRET } = getKeySecret(res) as {
    KEY: string;
    SECRET: string;
  };

  const token = accessToken || req.cookies.accessToken;
  const tokenSecret = accessTokenSecret || req.cookies.accessTokenSecret;

  if (!token || !tokenSecret) {
    throw new Error('Access token and secret are required');
  }

  return new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: KEY,
      consumerSecret: SECRET,
      accessToken: token,
      accessTokenSecret: tokenSecret,
    },
  });
};

export const getUserProfile = async (
  res: Response,
  req: Request,
  accessToken?: string,
  accessTokenSecret?: string,
) => {
  let client = authorizedDiscogsClient(
    res,
    req,
    accessToken,
    accessTokenSecret,
  );

  let response = await client.getIdentity();
  let profile = await client.user().getProfile(response.data.username);

  return profile;
};
