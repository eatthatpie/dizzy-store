import Store from './Store';

describe(`Store`, () => {
    it(`is testable`, () => {
        expect(1).toBeTruthy();
    });

    test(`getter should throw error if the path does not match any module getter`, () => {
        const store = new Store();

        expect(() => store.get('getter.doesNotExist')).toThrow();
    });

    test(`dispatcher should throw error if the path does not match any module getter`, () => {
        const store = new Store();

        expect(() => store.dispatch('dispatcher.doesNotExist', {})).toThrow();
    });

    test(`getter should resolve module's getter`, () => {
        const store = new Store();

        store.registerModule('test', {
            state: {
                test: 1928
            },
            getters: {
                testValue({ getState }) {
                    return getState().test
                },
                filteredValue({ getState }, { factor }) {
                    return getState().test * factor
                }
            }
        });

        expect(store.get('test.testValue')).toEqual(1928);
        
        expect(store.get('test.filteredValue', { factor: 0.5 })).toEqual(964);
    });

    test(`dispatcher should resolve module's dispatcher`, () => {
        const store = new Store();

        store.registerModule('test', {
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

        store.dispatch('test.increaseTestValue', 72);

        expect(store.get('test.testValue')).toEqual(2000);
    });
});