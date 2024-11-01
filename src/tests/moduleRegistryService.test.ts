import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ModuleRegistryService } from '../services/moduleRegistryService';
import { ModuleRegistry } from '../models/moduleRegistry';

dotenv.config({ path: '.env.test' });

describe('ModuleRegistryService', () => {
    let moduleRegistryService: ModuleRegistryService;
    let testDirectory: string;

    beforeAll(() => {
        if (!process.env.JSON_UPLOAD_DIRECTORY) {
            throw new Error("JSON_UPLOAD_DIRECTORY is not set");
        }
    });

    beforeEach(() => {
        moduleRegistryService = new ModuleRegistryService();
        testDirectory = process.env.JSON_UPLOAD_DIRECTORY!;

        if (!fs.existsSync(testDirectory)) {
            fs.mkdirSync(testDirectory, { recursive: true });
        }

        const moduleRegistry = ModuleRegistry.getInstance();
        moduleRegistry.clear();
    });

    afterEach(() => {
        if (fs.existsSync(testDirectory)) {
            fs.rmSync(testDirectory, { recursive: true });
        }
    });

    test('should load existing JSON files and create UserModules', () => {
        const userJsons = [
            {
                name: "User 1",
                provider: {
                    content_module: "authz.provider_1",
                    auth_module: "authn.provider_1"
                }
            },
            {
                name: "User 2",
                provider: {
                    content_module: "authz.provider_2",
                    auth_module: "authn.provider_2"
                }
            }
        ];

        userJsons.forEach((userJson, index) => {
            fs.writeFileSync(path.join(testDirectory, `user${index + 1}.json`), JSON.stringify(userJson));
        });

        moduleRegistryService.loadExistingJsons();

        const moduleRegistry = ModuleRegistry.getInstance();
        const userModules = moduleRegistry.getUserModules();
        expect(userModules.length).toBe(2);
        expect(userModules[0].getName()).toBe("User 1");
        expect(userModules[1].getName()).toBe("User 2");
    });

    test('should not load any JSON files if directory is empty', () => {
        fs.rmSync(testDirectory, { recursive: true });
        fs.mkdirSync(testDirectory, { recursive: true });

        moduleRegistryService.loadExistingJsons();

        const moduleRegistry = ModuleRegistry.getInstance();
        const userModules = moduleRegistry.getUserModules();
        expect(userModules.length).toBe(0);
    });

    test('should handle invalid JSON files', () => {
        fs.writeFileSync(path.join(testDirectory, 'invalidUser.json'), 'invalid json');
    
        moduleRegistryService.loadExistingJsons();
    
        const moduleRegistry = ModuleRegistry.getInstance();
        const userModules = moduleRegistry.getUserModules();
        expect(userModules.length).toBe(0);
    });

    test('should throw error when directory does not exist', () => {
        const invalidDirectory = path.join(testDirectory, 'non_existing_directory');
        
        moduleRegistryService['directoryPath'] = invalidDirectory;

        expect(() => moduleRegistryService.loadExistingJsons()).toThrowError('No such file or directory');
    });

    test('should not add null or invalid JSON data', () => {
        fs.writeFileSync(path.join(testDirectory, 'nullUser.json'), JSON.stringify(null));
        fs.writeFileSync(path.join(testDirectory, 'emptyUser.json'), JSON.stringify({}));
    
        moduleRegistryService.loadExistingJsons();
    
        const moduleRegistry = ModuleRegistry.getInstance();
        const userModules = moduleRegistry.getUserModules();
    
        expect(userModules.length).toBe(0);
    });
});