import { Request, Response } from 'express';
import { IModuleRegistryService } from '../interfaces/IModuleRegistryService';
import { ModuleRegistryService } from '../services/moduleRegistryService';

const moduleRegistryService: IModuleRegistryService = new ModuleRegistryService();

export const userModules = (req: Request, res: Response) => {
    try {
        res.status(200);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Unexpected error' });
    }
};