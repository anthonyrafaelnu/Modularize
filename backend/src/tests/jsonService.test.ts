import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { JsonService } from '../services/jsonService';
import { ModuleRegistry } from '../models/moduleRegistry';

dotenv.config({ path: '.env.test' });

describe('JsonService', () => {
    let jsonService: JsonService;
    let testDirectory: string;

    beforeAll(() => {
        if (!process.env.JSON_UPLOAD_DIRECTORY) {
            throw new Error("JSON_UPLOAD_DIRECTORY is not set");
        }
    });

    beforeEach(() => {
        jsonService = new JsonService();
        
        testDirectory = process.env.JSON_UPLOAD_DIRECTORY!;

        if (!fs.existsSync(testDirectory)) {
            fs.mkdirSync(testDirectory, { recursive: true });
        }

        ModuleRegistry.getInstance().clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
        if (fs.existsSync(testDirectory)) {
            fs.rmSync(testDirectory, { recursive: true });
        }
    });

    test('should save JSON file successfully', () => {
        const data = {
            name: "User 0",
            provider: {
                content_module: "authz.provider_4",
                auth_module: "authn.provider_3"
            }
        };

        jsonService.saveJson(data, data.name + '.json');

        const filePath = path.join(testDirectory, data.name + '.json');
        expect(fs.existsSync(filePath)).toBe(true);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        expect(JSON.parse(fileContent)).toEqual(data);
    });

    test('should save empty JSON object', () => {
        const filename = 'empty.json';
        const data = {};

        jsonService.saveJson(data, filename);

        const filePath = path.join(testDirectory, filename);
        expect(fs.existsSync(filePath)).toBe(true);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        expect(JSON.parse(fileContent)).toEqual(data);
    });

    test('should throw error when filename is empty', () => {
        const data = {
            name: "",
            provider: {
                content_module: "authz.provider_4",
                auth_module: "authn.provider_3"
            }
        };

        expect(() => jsonService.saveJson(data, "")).toThrowError('Filename cannot be empty');
    });

    test('should overwrite existing JSON file', () => {
        const filename = 'overwrite.json';
        const data1 = { name: "User 1" };
        const data2 = { name: "User 2" };

        jsonService.saveJson(data1, filename);
        jsonService.saveJson(data2, filename);

        const filePath = path.join(testDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        expect(JSON.parse(fileContent)).toEqual(data2);
    });

});