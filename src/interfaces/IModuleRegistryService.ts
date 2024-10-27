export interface IModuleRegistryService {
    loadExistingJsons(): void;
    getModuleReport(): Record<string, Record<string, string[]>>;
}