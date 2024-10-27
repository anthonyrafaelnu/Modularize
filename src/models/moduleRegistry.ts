import { UserModule } from './userModule';

export class ModuleRegistry {
    private static instance: ModuleRegistry;
    private userModules: UserModule[] = [];

    private constructor() {}

    public static getInstance(): ModuleRegistry {
        if (!ModuleRegistry.instance) {
            ModuleRegistry.instance = new ModuleRegistry();
        }
        return ModuleRegistry.instance;
    }

    public addUserModule(userModule: UserModule): void {
        this.userModules.push(userModule);
    }

    public getUserModules(): UserModule[] {
        return this.userModules;
    }

    public clear(): void {
        this.userModules = [];
    }
}