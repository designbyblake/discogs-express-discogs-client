import { Request, Response, NextFunction } from 'express';
import { setCookies } from '../helpers/cookies';
import {
  discogsOAuth,
  authorizedDiscogsClient,
} from '../helpers/discogsHelpers';
import dotenv from 'dotenv';
dotenv.config();

export const getRequestToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oAuth = discogsOAuth(res);

    const { callbackURL } = req.body;
    if (!callbackURL) {
      return res.status(500).json({ error: 'Callback URL not set' });
    }

    const { token, tokenSecret, authorizeUrl } =
      await oAuth.getRequestToken(callbackURL);

    setCookies(res, 'token', token);
    setCookies(res, 'token_secret', tokenSecret);

    res.json({
      authorizeURL: authorizeUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccessTokenSecret = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oAuth = discogsOAuth(res);
    const { oauth_verifier } = req.body;
    const { token, token_secret } = req.cookies;

    if (!token || !token_secret || !oauth_verifier) {
      return res
        .status(400)
        .json({ error: 'token, token_secret and oauth_verifier are required' });
    }

    const { accessToken, accessTokenSecret } = await oAuth.getAccessToken(
      token,
      token_secret,
      oauth_verifier,
    );

    setCookies(res, 'oauth_verifier', oauth_verifier);
    setCookies(res, 'accessToken', accessToken);
    setCookies(res, 'accessTokenSecret', accessTokenSecret);

    let client = authorizedDiscogsClient(res, req);
    let response = await client.getIdentity();

    res.json({
      id: response.data.id,
      username: response.data.username,
      resource_url: response.data.resource_url,
    });
  } catch (error) {
    next(error);
  }
};
