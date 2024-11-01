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
        const providers: Set<string> = new Set();
        const users: Map<string, Set<string>> = new Map();
    
        for (const userModule of this.userModules) {
            const userName = userModule.getName();
            const providersOfModule = new Set(userModule.getProviderValues());
    
            providersOfModule.forEach(provider => providers.add(provider));
    
            users.set(userName, providersOfModule);
        }
    
        const selectedUsers: Set<string> = new Set();
        const coveredProviders: Set<string> = new Set();
    
        while (coveredProviders.size < providers.size) {
            let bestUser: string | null = null;
            let maxCoveredNewProviders = 0;
    
            for (const [user, userProviders] of users.entries()) {
                const newCovered = new Set(
                    [...userProviders].filter(provider => !coveredProviders.has(provider))
                );
    
                if (newCovered.size > maxCoveredNewProviders) {
                    bestUser = user;
                    maxCoveredNewProviders = newCovered.size;
                }
            }
    
            if (bestUser) {
                selectedUsers.add(bestUser);
                users.get(bestUser)!.forEach(provider => coveredProviders.add(provider));
                users.delete(bestUser);
            } else {
                break;
            }
        }
    
        return Array.from(selectedUsers);
    }    

    public getUserModules(): UserModule[] {
        return this.userModules;
    }

    public clear(): void {
        this.userModules = [];
        this.moduleReports = {};
    }
}