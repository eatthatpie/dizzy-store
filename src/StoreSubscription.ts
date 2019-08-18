import ModuleResolver from '@/helpers/ModuleResolver';
import StoreInterface from '@/interfaces/StoreInterface';
import StoreSubscriberInterface from '@/interfaces/StoreSubscriberInterface';
import StoreSubscriptionInterface from '@/interfaces/StoreSubscriptionInterface';

export default class StoreSubscription implements StoreSubscriptionInterface {
    private dispatch: Function;
    private get: Function;
    private moduleGetterPath: Array<string>;
    private dataMapperFunc: Function;
    private subscriber: StoreSubscriberInterface;

    constructor(store: StoreInterface, moduleGetterPath: string|Array<string>) {
        this.dispatch = store.dispatch.bind(store);
        this.get = store.get.bind(store);
        this.moduleGetterPath = Array.isArray(moduleGetterPath) ? [].concat(moduleGetterPath) : [moduleGetterPath];
    }

    private getMappedData(): any {
        return this.dataMapperFunc(
            this.getRawData()
        );
    }

    private getRawData(): any {
        if (this.moduleGetterPath.length === 1) {
            return this.get(this.moduleGetterPath[0]);
        }

        const gettersDataMap = this.moduleGetterPath.map(getterPath => {
            const { moduleName, moduleParam } = ModuleResolver.resolvePath(getterPath);

            return {
                moduleName,
                moduleParam,
                data: this.get(getterPath)
            };
        });

        let out = {};

        gettersDataMap.forEach(item => {
            if (!out.hasOwnProperty(item.moduleName)) {
                out[item.moduleName] = {};
            }

            if (!out[item.moduleName].hasOwnProperty(item.moduleParam)) {
                out[item.moduleName][item.moduleParam] = {};
            }

            out[item.moduleName][item.moduleParam] = item.data;
        });

        return out;
    }

    public to(subscriber: StoreSubscriberInterface, dataMapperFunc: Function): void {
        this.subscriber = subscriber;
        this.dataMapperFunc = dataMapperFunc;

        this.subscriber.storeData(
            {
                get: this.get,
                dispatch: this.dispatch
            },
            this.getMappedData()
        );
    }

    public onUpdate(moduleDispatcherPath: string): void {
        if (this.isSubscribedToModuleFromPath(moduleDispatcherPath)) {
            this.subscriber.storeDataChange(
                {
                    get: this.get,
                    dispatch: this.dispatch
                },
                this.getMappedData()
            );
        }
    }

    private isSubscribedToModuleFromPath(moduleDispatcherPath: string) {
        return this.moduleGetterPath
            .filter(getterPath => {
                return ModuleResolver.moduleNamesMatch(
                    getterPath,
                    moduleDispatcherPath
                );
            })
            .length > 0
    }
};