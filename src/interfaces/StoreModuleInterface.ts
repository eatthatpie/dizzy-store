export default interface StoreModuleInterface {
    callDispatcher(name: string, params?: any): void;
    callGetter(name: string, params?: any): any;
    getName(): string;
};