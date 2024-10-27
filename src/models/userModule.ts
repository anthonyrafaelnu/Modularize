export class UserModule {
    private name: string = "";
    private provider: Map<string, string>;

    constructor() {
        this.provider = new Map<string, string>();
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public setProvider(key: string, value: string): void {
        this.provider.set(key, value);
    }

    public getProvider(key: string): string | undefined {
        return this.provider.get(key);
    }

    public getProviderKeys(): string[] {
        return Array.from(this.provider.keys());
    }

    public toJSON() {
        return {
            name: this.name,
            provider: Object.fromEntries(this.provider),
        };
    }
}