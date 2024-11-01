import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import jsonRoutes from './routes/jsonRoutes';
import { ModuleRegistryService } from './services/moduleRegistryService';

const app = express();
app.use(express.json());
app.use('/json', jsonRoutes);

const moduleRegestryService = new ModuleRegistryService();
moduleRegestryService.loadExistingJsons();

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Server running on port 3000');
  });
}

export default app;