# dizzy-store

Simple state management library for JS apps.

## Getting started

### Instalation

```npm i --save dizzy-store```

```js
import { Store, StoreModule, StoreSubscription } from 'dizzy-store';
```

or, include `/dist/dizzy-store.min.js` file:

```html
<script src="dizzy-store.min.js"></script>
```

Then you can access Store via DizzyStore variable:

```js
var store = new DizzyStore.Store();
```

### Basic usage

```js
// create store object
const store = new Store();

// register store module
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

// dispatch an action
store.dispatch('test.increaseTestValue', 72);

// get new value
var testValue = store.get('test.testValue');

console.log(testValue); // output: 2000
```

## Core concepts

In dizzy-store there is no single state management object. Instead every group of state/dispatchers is divided into modules.

You cannot create a module directly. Instead register module via store's `registerModule` method:

```js
// basic module schema
store.registerModule('moduleName', {
    state: {/*...*/},
    getters: {/*...*/},
    dispatchers: {/*...*/}
});
```

## State and getters

Getters allows to read computed value of the state with `getState` method:

```js
{
    state: {
        a: 1,
        b: 2
    },
    getters: {
        getterName({ getState }) {
            return getState().a // returns 1
            return getState(); // returns { a: 1, b: 2 }
        }
    }
}
```

Getters can also be functions:

```js
const store = new Store();

store.registerModule('test', {
    state: {
        test: 1928
    },
    getters: {
        filteredValue({ getState }, { factor }) {
            return getState().test * factor
        }
    }
});
        
const newValue = store.get('test.filteredValue', { factor: 0.5 });

console.log(newValue); // output: 964
```

You access the getter by calling store's `get` method:

```js
store.get('moduleName.getterFunctionName', { optionalParams });
```

## Dispatchers

Each module's state is immutable yet you can change the state by module's dispatcher. Effects of `setState` method called in dispatcher body merge with the current state.

```js
{
    state: {
        a: 1
    },
    dispatchers: {
        dispatcherName({ getState, setState }, paramValueOrParamsObject) {
            const stateValue = getState().a;

            setState({
                a: stateValue + 1
            });
        }
    }
}
```

Example:

```js
const module = new StoreModule('exampleModule', {
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
    
store.dispatch('exampleModule.increaseTestValue', 72);
        
console.log(store.get('exampleModule.keepedValue')); // output: 12
```

You access the dispatcher by calling store's `dispatch` method:

```js
store.dispatch('moduleName.dispatcherFunctionName', { params });
```

## Subscribing to the store module

### Listeners

Listeners can be subscribed to getters. Each listener should implement two methods:

`storeData` -- is fired on subscription,  
`storeDataChange` -- is fired each time any dispatcher associated with getter's module is called.

Example:

```js
const subscriber = new (class {
    initialMappedData = null;

    storeData({ get, dispatch }, { mappedData }) {
        // get and dispatch work like store.get and store.dispatch methods respectively
        console.log('storeData fired');
        this.initialMappedData = mappedData;
    }
    
    storeDataChange({ get, dispatch }, { mappedData }) {
        // get and dispatch work like store.get and store.dispatch methods respectively
        console.log('storeDataChange fired');
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
    
// When subscribed to single getter the data argument contains the getter value. So the someValue() getter value will be placed in data.someValue
store.subscribe('test.testValue').to(subscriber, data => {
    return {
        mappedData: data
    };
}); // output: storeData fired

store.dispatch('test.increaseValue', 72); // output: storeDataChange fired

console.log(subscriber.initialMappedData); // output: 2000
```

### Subscribing to more than one getter

Example:

```js
const subscriber = new (class {
    mappedValue = 0;

    storeData({ get, dispatch }, { mappedValue, factor }) {
        this.mappedValue = mappedValue;
    }
    
    storeDataChange({ get, dispatch }, { mappedValue, factor }) {
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
    
// Note, that when subscribed to more than one getter the data argument contains the getters values mapped by module's name. So the someValue() getter value will be placed in data.moduleName.someValue
store.subscribe(['test.testValue', 'test.factor']).to(subscriber, data => {
    return {
        mappedValue: data.test.testValue,
        factor: data.test.factor
    };
});

store.dispatch('test.increaseValue', 72);

console.log(subscriber.mappedValue); // output: 4000
```

## Learn more

Learn more by diving into specs: https://github.com/eatthatpie/dizzy-store/tree/develop/src.

## Roadmap

* Global dispatchers
* Event sourcing