import { Request, Response } from 'express';
import { IModuleRegistryService } from '../interfaces/IModuleRegistryService';
import { ModuleRegistryService } from '../services/moduleRegistryService';

const moduleRegistryService: IModuleRegistryService = new ModuleRegistryService();

export const userModules = (req: Request, res: Response): void => {
    try {
        res.status(200).json(moduleRegistryService.getModuleReport());
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        res.status(500).json({ message: errorMessage });
    }
};

export const userSet = (req: Request, res: Response): void => {
    try {
        res.status(200).json(moduleRegistryService.findMinimumUserSet());
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        res.status(500).json({ message: errorMessage });
    }
}