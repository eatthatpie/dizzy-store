import StoreModule from './StoreModule';

describe(`Store module`, () => {
    it(`is testable`, () => {
        expect(1).toBeTruthy();
    });

    test(`state is accessible via getters`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                }
            }
        });
    
        expect(module.callGetter('testValue')).toEqual(1928);
    });

    test(`getters can filter the returned state with params`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 964
            },
            getters: {
                testValue({ getState }, { factor }) {
                    return getState().test * factor
                }
            }
        });
    
        expect(module.callGetter('testValue', { factor: 2 })).toEqual(1928);
    });

    it(`should throw error if getter is not defined`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                }
            }
        });
    
        expect(() => module.callGetter('test')).toThrow();
    })

    test(`state can be modified by dispatchers`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                }
            },
            dispatchers: {
                increaseTestValue({ getState, setState }, value) {
                    const increasedValue = getState().test + value;

                    setState({
                        test: increasedValue
                    });
                }
            }
        });
    
        module.callDispatcher('increaseTestValue', 72);
        
        expect(module.callGetter('testValue')).toEqual(2000);
    });

    test(`dispatcher merges state changes`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 1928,
                keepedValue: 12
            },
            getters: {
                keepedValue({ getState }) {
                    return getState().keepedValue;
                },
                testValue({ getState }) {
                    return getState().test
                }
            },
            dispatchers: {
                increaseTestValue({ getState, setState }, value) {
                    const increasedValue = getState().test + value;

                    setState({
                        test: increasedValue
                    });
                }
            }
        });
    
        module.callDispatcher('increaseTestValue', 72);
        
        expect(module.callGetter('keepedValue')).toEqual(12);
    });

    it(`should throw error if dispatcher is not defined`, () => {
        const module = new StoreModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                }
            }
        });
    
        expect(() => module.callDispatcher('test', {})).toThrow();
    })
});