import { IModuleRegistryService } from '../interfaces/IModuleRegistryService';
import fs from 'fs';
import path from 'path';
import { ModuleRegistry } from '../models/moduleRegistry';
import { UserModule } from '../models/userModule';

export class ModuleRegistryService implements IModuleRegistryService {

    private directoryPath: string;
    private moduleRegistry: ModuleRegistry;

    constructor() {
        this.directoryPath = process.env.JSON_UPLOAD_DIRECTORY!;

        if (!fs.existsSync(this.directoryPath)) {
            fs.mkdirSync(this.directoryPath, { recursive: true });
        }

        this.moduleRegistry = ModuleRegistry.getInstance();
    } 

    public loadExistingJsons(): void {
        if (!fs.existsSync(this.directoryPath)) {
            throw new Error('No such file or directory');
        }
    
        const files = fs.readdirSync(this.directoryPath);
        files.forEach(file => {
            const filePath = path.join(this.directoryPath, file);
            if (path.extname(file) === '.json') {
                try {
                    const data = fs.readFileSync(filePath, 'utf-8');
                    const userModuleData = JSON.parse(data);
    
                    if (!userModuleData || typeof userModuleData !== 'object' || Object.keys(userModuleData).length === 0) {
                        return;
                    }
    
                    const userModule = this.parseJsonToUserModule(userModuleData);
                    this.moduleRegistry.addUserModule(userModule);
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
                    console.warn(errorMessage);
                    return;
                }
            }
        });
    }    
    
    public isValidUserModule(filePath: string): boolean {
        if (!fs.existsSync(filePath)) {
            return false;
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const userModuleData = JSON.parse(data);

        if (!userModuleData || typeof userModuleData !== 'object' || Object.keys(userModuleData).length === 0) {
            return false;
        }

        try {
            this.parseJsonToUserModule(userModuleData);
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
            console.warn(errorMessage);
            return false;
        }

    }
    
    public loadNewJsonToUserModule(filePath: string): void {
        if (!fs.existsSync(filePath)) {
            throw new Error('No such file or directory');
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const userModuleData = JSON.parse(data);

        if (!userModuleData || typeof userModuleData !== 'object' || Object.keys(userModuleData).length === 0) {
            console.warn('Invalid JSON data');
        }

        const userModule = this.parseJsonToUserModule(userModuleData);
        this.moduleRegistry.addUserModule(userModule);
    }
    
    public saveUserModule(userModule: UserModule): void {
        this.moduleRegistry.addUserModule(userModule);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public parseJsonToUserModule(data: any): UserModule {
        if (!data) {
            throw new Error('Data cannot be null');
        }

        if (typeof data !== 'object') {
            throw new Error('Invalid data');
        }
        
        if (!data.provider || typeof data.provider !== 'object') {
            throw new Error('Invalid provider');
        }

        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Invalid name');
        }

        const userModule = new UserModule();

        userModule.setName(data.name);

        for (const providerKey in data.provider) {
            if (Object.prototype.hasOwnProperty.call(data.provider, providerKey)) {
                userModule.setProvider(providerKey, data.provider[providerKey]);
            }
        }
        
        return userModule;
    }

    public getModuleReport(): Record<string, Record<string, string[]>> {
        return this.moduleRegistry.getModuleReport();
    }

    public findMinimumUserSet(): string[] {
        return this.moduleRegistry.findMinimumUserSet();
    }
}