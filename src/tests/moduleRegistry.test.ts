import { ModuleRegistry } from "../models/moduleRegistry";
import { UserModule } from "../models/userModule";

describe('ModuleRegistry', () => {
    let moduleRegistry: ModuleRegistry;

    beforeEach(() => {
        moduleRegistry = ModuleRegistry.getInstance();
        moduleRegistry.clear();
    });

    test('should add a user module correctly for multiple providers', () => {
        const userModule = new UserModule();
        userModule.setName('User 0');
        userModule.setProvider('content_module', 'authz.provider_4');
        userModule.setProvider('auth_module', 'authn.provider_3');

        moduleRegistry.addUserModule(userModule);

        const reports = moduleRegistry.getModuleReport();
        expect(reports).toEqual({
            content_module: {
                'authz.provider_4': ['User 0'],
            },
            auth_module: {
                'authn.provider_3': ['User 0'],
            },
        });
    });

    test('should aggregate users under the same provider', () => {
        const userModule1 = new UserModule();
        userModule1.setName('User 0');
        userModule1.setProvider('content_module', 'authz.provider_4');

        const userModule2 = new UserModule();
        userModule2.setName('User 1');
        userModule2.setProvider('content_module', 'authz.provider_4');

        moduleRegistry.addUserModule(userModule1);
        moduleRegistry.addUserModule(userModule2);

        const reports = moduleRegistry.getModuleReport();
        expect(reports).toEqual({
            content_module: {
                'authz.provider_4': ['User 0', 'User 1'],
            },
        });
    });

    test('should handle multiple modules and providers correctly', () => {
        const userModule1 = new UserModule();
        userModule1.setName('User 0');
        userModule1.setProvider('content_module', 'authz.provider_4');
        userModule1.setProvider('auth_module', 'authn.provider_3');

        const userModule2 = new UserModule();
        userModule2.setName('User 1');
        userModule2.setProvider('content_module', 'authz.provider_4');
        userModule2.setProvider('auth_module', 'authn.provider_2');

        moduleRegistry.addUserModule(userModule1);
        moduleRegistry.addUserModule(userModule2);

        const reports = moduleRegistry.getModuleReport();
        expect(reports).toEqual({
            content_module: {
                'authz.provider_4': ['User 0', 'User 1'],
            },
            auth_module: {
                'authn.provider_3': ['User 0'],
                'authn.provider_2': ['User 1'],
            },
        });
    });

    test('should not add duplicate users for the same provider', () => {
        const userModule = new UserModule();
        userModule.setName('User 0');
        userModule.setProvider('content_module', 'authz.provider_4');

        const userModuleDuplicate = new UserModule();
        userModuleDuplicate.setName('User 0');
        userModuleDuplicate.setProvider('content_module', 'authz.provider_4');

        moduleRegistry.addUserModule(userModule);
        moduleRegistry.addUserModule(userModuleDuplicate);

        const reports = moduleRegistry.getModuleReport();
        expect(reports).toEqual({
            content_module: {
                'authz.provider_4': ['User 0'],
            },
        });
    });
});