import Store from './Store';
import StoreSubscriberInterface from '@/interfaces/StoreSubscriberInterface';

describe(`Store subscription`, () => {
    it(`passes getter value to subscriber on subscription`, () => {
        const subscriber = new (class implements StoreSubscriberInterface {
            public initialMappedData: any = null;

            public storeData({ get, dispatch }, { mappedData }): any {
                this.initialMappedData = mappedData;
            }
    
            public storeDataChange({ get, dispatch }, { mappedData }): any {
                this.initialMappedData = mappedData;
            }
        })();
    
        const store = new Store();
    
        store.registerModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test;
                }
            }
        });
    
        store.subscribe('test.testValue').to(subscriber, data => {
            return {
                mappedData: data
            };
        });

        expect(subscriber.initialMappedData).toEqual(1928);
    });

    test(`subscriber fires update method on any of module's dispatcher call`, () => {
        const subscriber = new (class implements StoreSubscriberInterface {
            public initialMappedData: any = null;

            public storeData({ get, dispatch }, { mappedData }): any {
                this.initialMappedData = mappedData;
            }
    
            public storeDataChange({ get, dispatch }, { mappedData }): any {
                this.initialMappedData = mappedData;
            }
        })();
    
        const store = new Store();
    
        store.registerModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test;
                }
            },
            dispatchers: {
                increaseValue({ getState, setState }, value) {
                    const increaseValue = getState().test + value;

                    setState({ test: increaseValue });
                }
            }
        });
    
        store.subscribe('test.testValue').to(subscriber, data => {
            return {
                mappedData: data
            };
        });

        store.dispatch('test.increaseValue', 72);

        expect(subscriber.initialMappedData).toEqual(2000);
    });

    test(`subscriber has access to global getters and setters`, () => {
        const subscriber = new (class implements StoreSubscriberInterface {
            public pingedTestValue: number = 0;

            public storeData({ get, dispatch }, {}): any {
                this.pingedTestValue = get('pinged.testValue');
            }
    
            public storeDataChange({ get, dispatch }, {}): any {
                dispatch('pinged.increaseValue', 28);
            }
        })();
    
        const store = new Store();

        store.registerModule('pinged', {
            state: {
                test: 72
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                }
            },
            dispatchers: {
                increaseValue({ getState, setState }, value) {
                    const increaseValue = getState().test + value;

                    setState({ test: increaseValue });
                }
            }
        });
    
        store.registerModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test;
                }
            },
            dispatchers: {
                increaseValue({ getState, setState }, value) {
                    const increaseValue = getState().test + value;

                    setState({ test: increaseValue });
                }
            }
        });
    
        store.subscribe('test.testValue').to(subscriber, data => {});

        expect(store.get('pinged.testValue')).toEqual(72);

        store.dispatch('test.increaseValue', 72);

        expect(store.get('pinged.testValue')).toEqual(100);
    });

    test(`subscriber can subscribe to more than one getter`, () => {
        const subscriber = new (class implements StoreSubscriberInterface {
            public mappedValue: number = 0;

            public storeData({ get, dispatch }, { mappedValue, factor }): any {
                this.mappedValue = mappedValue;
            }
    
            public storeDataChange({ get, dispatch }, { mappedValue, factor }): any {
                this.mappedValue = mappedValue * factor;
            }
        })();
    
        const store = new Store();
    
        store.registerModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test;
                },
                factor({ getState }) {
                    return getState().test / 1000;
                }
            },
            dispatchers: {
                increaseValue({ getState, setState }, value) {
                    const increaseValue = getState().test + value;

                    setState({ test: increaseValue });
                }
            }
        });
    
        store.subscribe(['test.testValue', 'test.factor']).to(subscriber, data => {
            return {
                mappedValue: data.test.testValue,
                factor: data.test.factor
            };
        });

        store.dispatch('test.increaseValue', 72);

        expect(subscriber.mappedValue).toEqual(4000);
    });
});