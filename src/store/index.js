import Vue from 'vue';
import Vuex from 'vuex';
// import auth from './modules/auth'
// import app from './modules/app'
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';
import cache from './cache';
import sync from './sync';


import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ['auth.user'],
      // getState: key => Cookies.getJSON(key),
      // setState: (key, state) => Cookies.set(key, state, {
      //   expires: 3,
      //   secure: true,
      // }),
    }),
    cache,
    sync,
  ],
  state: {
    initialized: false,
  },
  mutations: {
    loadFromCache(state, cached) {
      if (cached) {
        Object.keys(cached).forEach((key) => {
          state[key] = Object.assign({}, state[key], cached[key]);
        });
      }

      state.initialized = true;
    },
  },
  modules,
  strict: process.env.NODE_ENV !== 'production',
});




// const store = new Vuex.Store({
//   plugins: [createPersistedState({
//     // getState: (key) => Cookies.getJSON(key),
//     // setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
//   })],
  
//   modules: {
//     auth,
//     app
//   },

//   state: {

//   },
//   mutations: {

//   },
//   actions: {

//   },
//   getters: {

//   }
// })

// export default store