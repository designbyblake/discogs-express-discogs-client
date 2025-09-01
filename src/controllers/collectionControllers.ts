import { Request, Response, NextFunction } from 'express';
import { DiscogsClient } from '@lionralfs/discogs-client';
import { CLIENT_AUTH } from '../constants/clientAuth';
import { authorizedDiscogsClient } from '../helpers/discogsHelpers';

export const getCollection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, page, per_page, sort, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const client = new DiscogsClient(CLIENT_AUTH).user().collection();

    const { data } = await client.getReleases(name, 0, {
      page: page || 1,
      per_page: per_page || 500,
      sort: sort || 'added',
      sort_order: sort_order || 'desc',
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getValues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const client = authorizedDiscogsClient(res, req);
    let { data } = await client.user().collection().getValue(name);

    res.json(data);
  } catch (error) {
    next(error);
  }
};
