import fs from 'fs';
import path from 'path';
import { IJsonService } from '../interfaces/IJsonService';
import { ModuleRegistryService } from './moduleRegistryService';

export class JsonService implements IJsonService {

    private directoryPath: string;
    private moduleRegistryService: ModuleRegistryService;

    constructor() {
        this.directoryPath = process.env.JSON_UPLOAD_DIRECTORY!;
        this.moduleRegistryService = new ModuleRegistryService();

        if (!fs.existsSync(this.directoryPath)) {
            fs.mkdirSync(this.directoryPath, { recursive: true });
        }
    }

    public saveJson(data: any, filename: string): void {

        if (!this.directoryPath) {
            throw new Error('Upload directory is not set');
        }

        if (!filename) {
            throw new Error('Filename cannot be empty');
        }

        const filePath = path.join(this.directoryPath, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        if(this.moduleRegistryService.isValidUserModule(filePath)) {
            this.moduleRegistryService.loadNewJsonToUserModule(filePath);
        }
    }
}