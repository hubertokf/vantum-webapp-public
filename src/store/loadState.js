import store from './index';
import {
  getState,
} from './storage';

export default function () {
  if (store.state.initialized) {
    return Promise.resolve();
  }

  return getState()
    .then(state => store.commit('loadFromCache', state));
}
