import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { JsonService } from '../services/jsonService';
import app from '../server';

/* eslint-disable */

jest.mock('../services/jsonService');

const mockJsonService = JsonService as jest.MockedClass<typeof JsonService>;

describe('Json Controller', () => {
    const testDirectory = path.join(__dirname, 'test_uploads');

    beforeAll(() => {
        process.env.NODE_ENV = 'test'; 
        if (!fs.existsSync(testDirectory)) {
            fs.mkdirSync(testDirectory);
        }
    });

    afterAll(() => {
        if (fs.existsSync(testDirectory)) {
            fs.rmSync(testDirectory, { recursive: true });
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should save JSON successfully and return 201', async () => {
        const data = {
            name: 'User1',
            provider: {
                content_module: 'authz.provider_4',
                auth_module: 'authn.provider_3'
            }
        };

        mockJsonService.prototype.saveJson.mockImplementation(() => {
            const filePath = path.join(testDirectory, `${data.name}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        });

        const res = await request(app).post('/json/save').send(data);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'JSON saved successfully' });

        const savedFile = path.join(testDirectory, 'User1.json');
        expect(fs.existsSync(savedFile)).toBe(true);
        const fileContent = JSON.parse(fs.readFileSync(savedFile, 'utf-8'));
        expect(fileContent).toEqual(data);
    });

    test('should return 500 on unexpected error in JsonService', async () => {
        const data = {
            name: 'User1',
            provider: {
                content_module: 'authz.provider_4',
                auth_module: 'authn.provider_3'
            }
        };

        mockJsonService.prototype.saveJson.mockImplementation(() => {
            throw new Error('Unexpected error');
        });

        const res = await request(app).post('/json/save').send(data);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Unexpected error');
    });
});