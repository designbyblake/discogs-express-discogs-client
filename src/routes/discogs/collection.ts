import { Router } from 'express';

import {
  getCollection,
  getValues,
} from '../../controllers/collectionControllers';

import {
  getRequestToken,
  getAccessTokenSecret,
  checkAccess,
  logout,
} from '../../controllers/oauthControllers';

const router = Router();

router.post('/discogs/collection', getCollection);
router.post('/discogs/collection/values', getValues);

router.post('/discogs/oauth/request_token', getRequestToken);
router.post('/discogs/oauth/access_token', getAccessTokenSecret);
router.post('/discogs/oauth/check_access', checkAccess);
router.post('/discogs/oauth/logout', logout);
export default router;
