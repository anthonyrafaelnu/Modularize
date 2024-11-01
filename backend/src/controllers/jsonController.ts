import { Request, Response } from 'express';
import { JsonService } from '../services/jsonService';
import { IJsonService } from '../interfaces/IJsonService';

const jsonService: IJsonService = new JsonService();

export const saveJson = (req: Request, res: Response) => {
    try {
        const data = req.body;
        
        jsonService.saveJson(data, data.name + '.json');

        res.status(201).json({ message: 'JSON saved successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Unexpected error' });
    }
};