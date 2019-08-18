import StoreModuleInterface from '@/interfaces/StoreModuleInterface';
import StoreModuleSchemaInterface from '@/interfaces/StoreModuleSchemaInterface';

export default class StoreModule implements StoreModuleInterface {
    protected dispatchers: object;
    protected getters: object;
    protected name: string;
    protected state: object;

    constructor(name: string, moduleSchema: StoreModuleSchemaInterface) {
        this.dispatchers = moduleSchema.dispatchers || null;
        this.getters = moduleSchema.getters || null;
        this.name = name;
        this.state = moduleSchema.state || {};
    }

    public callDispatcher(name: string, params?: any): void {
        const getState = this.getState.bind(this);
        const setState = this.setState.bind(this);
        const dispatcher = this.dispatchers ? this.dispatchers[name] : null;

        if (!dispatcher) {
            throw new Error(`No dispatcher named ${name} is not defined in store module.`);
        }

        dispatcher({ getState, setState }, params);
    }

    public callGetter(name: string, params?: any): any {
        const getState = this.getState.bind(this);
        const getter = this.getters[name];

        if (!getter) {
            throw new Error(`No getter named ${name} is not defined in store module.`);
        }

        return getter({ getState }, params);
    }

    public getName(): string {
        return this.name;
    }

    private getState(): any {
        return this.state
    }

    private setState(params: any): void {
        const keys = Object.keys(params);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            this.state[key] = params[key];
        }
    }
};