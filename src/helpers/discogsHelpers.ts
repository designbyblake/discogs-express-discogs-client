import { DiscogsOAuth, DiscogsClient } from '@lionralfs/discogs-client';
import { Response, Request } from 'express';

import { getKeySecret } from './secretKey';
import { access } from 'fs';

export const discogsOAuth = (res: Response) => {
  const { KEY, SECRET } = getKeySecret(res) as {
    KEY: string;
    SECRET: string;
  };

  return new DiscogsOAuth(KEY, SECRET);
};

export const authorizedDiscogsClient = (res: Response, req: Request) => {
  const { KEY, SECRET } = getKeySecret(res) as {
    KEY: string;
    SECRET: string;
  };
  const { accessToken, accessTokenSecret } = req.cookies;
  return new DiscogsClient({
    auth: {
      method: 'oauth',
      consumerKey: KEY,
      consumerSecret: SECRET,
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    },
  });
};
