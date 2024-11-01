import { UserModule } from './userModule';

export class ModuleRegistry {
    private static instance: ModuleRegistry;
    private userModules: UserModule[] = [];
    private moduleReports: Record<string, Record<string, string[]>> = {};

    private constructor() {}

    public static getInstance(): ModuleRegistry {
        if (!ModuleRegistry.instance) {
            ModuleRegistry.instance = new ModuleRegistry();
        }
        return ModuleRegistry.instance;
    }

    public addUserModule(userModule: UserModule): void {
        if (!userModule || !userModule.getName() || !userModule.getProviderKeys()) {
            return;
        }
        this.userModules.push(userModule);
        this.updateModuleReport(userModule);
    }

    public updateModuleReport(userModule: UserModule): void {
        const providerKeys = userModule.getProviderKeys();
        const userName = userModule.getName();

        providerKeys.forEach((providerKey) => {
            const moduleType = providerKey;

            if (!this.moduleReports[moduleType]) {
                this.moduleReports[moduleType] = {};
            }

            const provider = userModule.getProvider(providerKey);
            if (provider && !this.moduleReports[moduleType][provider]) {
                const provider = userModule.getProvider(providerKey);
                if (provider) {
                    this.moduleReports[moduleType][provider] = [];
                }
            }

            const providerName = userModule.getProvider(providerKey)!;
            if (!this.moduleReports[moduleType][providerName].includes(userName)) {
                this.moduleReports[moduleType][providerName].push(userName);
            }
        });
    }

    public getModuleReport(): Record<string, Record<string, string[]>> {
        const formattedReports: Record<string, Record<string, string[]>> = {};
        
        for (const [moduleType, providers] of Object.entries(this.moduleReports)) {
            formattedReports[moduleType] = providers;
        }
        
        return formattedReports;
    }
    
    findMinimumUserSet(): string[] {
        
        let providers: Set<string> = new Set();
        const users: Set<string> = new Set();

        for (const userModule of this.userModules) {
            const providersOfModule: Map<string, string> = userModule.getProviders();
    
            for (const provider of providersOfModule.values()) {
                providers.add(provider);
            }
        }

        for (const userModule of this.userModules) {
            const userName = userModule.getName();
            let providersOfModule = userModule.getProviderValues();

            providers.forEach(provider => {
                if(providersOfModule.includes(provider)){
                    providers.delete(provider);
                    if(!users.has(userName)){
                        users.add(userName);
                    }
                }
            });

            providers.values()
        }

        return Array.from(users);
    }
    

    public getUserModules(): UserModule[] {
        return this.userModules;
    }

    public clear(): void {
        this.userModules = [];
        this.moduleReports = {};
    }
}