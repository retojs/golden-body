function createGoldenReduxStore(reducer) {
    let state = {};
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener())
    }

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l != listener);
        }
    }

    return { getState, dispatch, subscribe };
}


function goldenReducer(state, action) {
    let newState = clone(state);
    action.exec(newState);
    return newState;
}

const goldenStore = createGoldenReduxStore(goldenReducer);

goldenStore.subscribe(() => {
    console.log("applying new state ", goldenStore.getState());
})

function clone(state) {
    if (typeof state === 'object') {
        return Object.keys(state).reduce((copy, key) => {
            copy[key] = clone(state[key]);
            return copy;
        }, {});
    } else {
        return state;
    }
}

const testState = {
    a: {
        aa: "sd"
    },
    b: 123,
    c: [{ x: "9" }, "9", 9]
}

let clonedTestState = clone(testState);
clonedTestState.a = 0;
console.log("testState=", testState);
console.log("cloned testState=", clonedTestState);


//
// Actions

ReduxAction = {};

function defineReduxAction(name, execFn) {
    ReduxAction[name] = function () {
        this.params = arguments[0];
    };
    ReduxAction[name].prototype.exec = execFn;
}

defineReduxAction('DoThis', function (state) {
    state.howItsDone = 'doing this ' + this.params.how;
    console.log(state.howItsDone);
})

goldenStore.dispatch(new ReduxAction.DoThis({ how: "with style" }));
goldenStore.dispatch(new ReduxAction.DoThis({ how: "with a vengence" }));
goldenStore.dispatch(new ReduxAction.DoThis({ how: "no more" }));

// So when you create a new ReduxAction you pass one single parameter object to the constructor.
// In the action's exec function you can access this object through this.params.
// Note: This will not work if you try to pass an arrow function to defineReduxAction.
