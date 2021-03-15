import { configureStore } from '@reduxjs/toolkit';
import throttle from 'lodash.throttle';

import { saveState, loadState } from '../localStorage/localStorage';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
