import { Router } from 'express';
import { saveJson } from '../controllers/jsonController';
import { userModules, userSet } from '../controllers/moduleRegistryController';

const router = Router();

router.post('/save', saveJson);
router.get('/moduleRegistry', userModules);
router.get('/userSet', userSet);

export default router;