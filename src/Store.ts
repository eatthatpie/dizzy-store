import ModuleResolver from '@/helpers/ModuleResolver';
import StoreInterface from '@/interfaces/StoreInterface';
import StoreModule from './StoreModule';
import StoreModuleInterface from '@/interfaces/StoreModuleInterface';
import StoreModuleSchemaInterface from '@/interfaces/StoreModuleSchemaInterface';
import StoreSubscriptionInterface from '@/interfaces/StoreSubscriptionInterface';
import StoreSubscription from './StoreSubscription';

// @TODO: this class need huge refactoring
export default class Store implements StoreInterface {
    private modules: Array<StoreModuleInterface>;
    private subscriptions: Array<StoreSubscriptionInterface>;

    constructor() {
        this.modules = [];
        this.subscriptions = [];
    }

    public dispatch(moduleDispatcherPath: string, params: any = {}): any {
        const { moduleName, moduleParam } = this.resolveModulePath(moduleDispatcherPath);

        this.getModule(moduleName).callDispatcher(moduleParam, params);

        this.subscriptions.forEach(subscription => {
            subscription.onUpdate(moduleDispatcherPath);
        });
    }

    public get(moduleGetterPath: string, params?: any): any {
        const { moduleName, moduleParam } = this.resolveModulePath(moduleGetterPath);

        return this.getModule(moduleName).callGetter(moduleParam, params);
    }

    private getModule(moduleName: string): StoreModuleInterface {
        const module = this.modules.find(item => item.getName() === moduleName);

        if (!module) {
            throw new Error(`Store module named ${moduleName} is not registered in store.`);
        }

        return module;
    }

    public registerModule(name: string, moduleSchema: StoreModuleSchemaInterface): void {
        this.modules.push(new StoreModule(name, moduleSchema));
    }

    private resolveModulePath(modulePath: string): any {
        return ModuleResolver.resolvePath(modulePath);
    }

    public subscribe(moduleGetterPath: string|Array<string>): StoreSubscriptionInterface {
        const subscription = new StoreSubscription(this, moduleGetterPath);

        this.subscriptions.push(subscription);

        return subscription;
    }
};