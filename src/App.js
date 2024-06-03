import React, { useContext, useEffect, useState } from 'react';

function App() {
  const initialState = {
    count: 0
  };

  const INCREMENT = 'INCREMENT';
  const DECREMENT = 'DECREMENT';

  const reducer = (state, action) => {
    switch (action.type) {
      case INCREMENT:
        return { count: state.count + 1 };
      case DECREMENT:
        return { count: state.count - 1 };
      default:
        return state;
    }
  };

  const createStore = (reducer, initialState) => {
    let state = initialState;
    let listeners = [];

    const getState = () => state;

    const dispatch = action => {
      state = reducer(state, action);
      listeners.forEach(listener => listener());
    };

    const subscribe = listener => {
      listeners.push(listener);

      // * Unsubscribe 
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    };

    return { getState, dispatch, subscribe };
  };

  const StoreContext = React.createContext(null);

  const useStore = () => {
    const store = useContext(StoreContext);
    const [state, setState] = useState(store.getState());

    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        setState(store.getState());
      });
      return () => {
        unsubscribe();
      };
    }, [store]);

    return [state, store.dispatch];
  };


  // * createStore() usage

  const store = createStore(reducer, initialState);

  const StoreProvider = ({ store, children }) => {
    return (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    );
  };

  const Counter = () => {
    const [state, dispatch] = useStore();
    
    return (
      <div>
        <h1>{state.count}</h1>
        <button onClick={() => dispatch({ type: INCREMENT })}>Increment</button>
        <button onClick={() => dispatch({ type: DECREMENT })}>Decrement</button>
      </div>
    );
  };

  return (
    <StoreProvider store={store}>
      <Counter />
    </StoreProvider>
  );
}

export default App;
