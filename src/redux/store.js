import { configureStore } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';

import { saveState, loadState } from '../localStorage/localStorage';
import usersReducer from './usersSlice';

// preloaded state (loaded from local storage) persists
// the state across the user's visits to the web app.
const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  preloadedState: loadState(),
});

// We'll subscribe to state changes, saving the store's state to the browser's
// local storage. We'll throttle this to prevent excessive work.
store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
