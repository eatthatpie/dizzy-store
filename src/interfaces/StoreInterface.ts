import StoreSubscriptionInterface from '@/interfaces/StoreSubscriptionInterface';

export default interface StoreInterface {
    dispatch(moduleGetterPath: string, params?: any): any;
    get(moduleGetterPath: string, params?: any): any;
    subscribe(moduleGetterPath: string|Array<string>): StoreSubscriptionInterface;
};