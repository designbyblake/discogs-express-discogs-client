import { Request, Response, NextFunction } from 'express';
import { setCookies } from '../helpers/cookies';
import { discogsOAuth, getUserProfile } from '../helpers/discogsHelpers';
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
  console.log('getAccessTokenSecret route called');
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

    // let client = authorizedDiscogsClient(res, req);
    // let response = await client.getIdentity();

    // res.json({
    //   id: response.data.id,
    //   username: response.data.username,
    //   resource_url: response.data.resource_url,
    // });

    const response = await getUserProfile(
      res,
      req,
      accessToken || undefined,
      accessTokenSecret || undefined,
    );

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

export const checkAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, accessTokenSecret } = req.cookies;

    if (!accessToken || !accessTokenSecret) {
      return res.status(200).json({ hasAccess: false });
    }
    const response = await getUserProfile(
      res,
      req,
      accessToken,
      accessTokenSecret,
    );

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('accessTokenSecret', { path: '/' });
    res.clearCookie('oauth_verifier', { path: '/' });
    res.clearCookie('token', { path: '/' });
    res.clearCookie('token_secret', { path: '/' });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
