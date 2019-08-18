import StoreSubscriberInterface from '@/interfaces/StoreSubscriberInterface';

export default interface StoreSubscriptionInterface {
    onUpdate(moduleDispatcherPath: string): any;
    to(
        subscriber: StoreSubscriberInterface,
        dataMapperFunc: Function
    ): any;
};