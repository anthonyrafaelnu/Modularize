import { Router } from 'express';
import { saveJson } from '../controllers/jsonController';
import { userModules } from '../controllers/moduleRegistryController';

const router = Router();

router.post('/save', saveJson);
router.get('/moduleRegistry', userModules);

export default router;