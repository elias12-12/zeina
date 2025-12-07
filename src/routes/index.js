import { Router } from 'express';
import { PagesController } from '../controllers/PagesController.js';

const router = Router();

router.get('/', PagesController.home);
router.get('/about', PagesController.about);
router.get('/bitcoin', PagesController.bitcoin);

export const IndexRoutes = router;
