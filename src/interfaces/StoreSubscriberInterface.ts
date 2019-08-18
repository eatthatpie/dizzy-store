export default interface StoreSubscriberInterface {
    storeData(accessors: Object, params?: any): any;
    storeDataChange(accessors: Object, params?: any): any;
};