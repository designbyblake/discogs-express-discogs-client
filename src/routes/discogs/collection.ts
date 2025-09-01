import { Router } from 'express';

import {
  getCollection,
  getValues,
} from '../../controllers/collectionControllers';

import {
  getRequestToken,
  getAccessTokenSecret,
} from '../../controllers/oauthControllers';

const router = Router();

router.post('/discogs/collection', getCollection);
router.post('/discogs/collection/values', getValues);

router.post('/discogs/oauth/request_token', getRequestToken);
router.post('/discogs/oauth/access_token', getAccessTokenSecret);
export default router;
