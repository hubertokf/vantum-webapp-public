import { services } from "./../api";

const state = {
  sharings: [],
  currentSharing: null
};

const getters = {
  getSharings: (state, getters, rootState, rootGetters) => {
    return state.sharings.filter(sharing => {
      if (sharing.project) {
        return sharing.project.name
          .toLowerCase()
          .includes(rootGetters.getSearchTerm.toLowerCase());
      }
      if (sharing.album) {
        return sharing.album.name
          .toLowerCase()
          .includes(rootGetters.getSearchTerm.toLowerCase());
      }
      if (sharing.plan) {
        return sharing.plan.name
          .toLowerCase()
          .includes(rootGetters.getSearchTerm.toLowerCase());
      }
    });
    // state.sharings,
  },
  getCountSharings: (state, getters, rootState, rootGetters) =>
    getters.getSharings.length,
  // getSharings: state => state.sharings,
  // getCountSharings: state => state.sharings.length,
  getCurrentSharing: state => state.currentSharing
};

const mutations = {
  post_sharing(state, sharing) {
    state.sharings.push(sharing);
  },
  get_sharings(state, sharings) {
    state.sharings = sharings;
  },
  get_sharing(state, sharing) {
    state.currentSharing = sharing;
  },
  edit_sharing(state, currentSharing) {
    var index = state.sharings.findIndex(
      sharing => sharing._id === currentSharing._id
    );
    this._vm.$set(state.sharings, index, currentSharing);
  },
  delete_sharing(state, currentSharing) {
    var index = state.sharings.findIndex(
      sharing => sharing.id === currentSharing.id
    );
    state.sharings.splice(index, 1);
  }
};

const actions = {
  postSharing({ commit }, sharing) {
    return services.sharing
      .post(sharing)
      .then(response => {
        commit("post_sharing", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getSharings({ commit }, filter) {
    return services.sharing
      .getAll(filter)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getUserSharings({ commit }, filter) {
    return services.sharing
      .getAll(filter)
      .then(response => {
        commit("get_sharings", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getSharing({ commit }, id) {
    return services.sharing
      .get(id)
      .then(response => {
        commit("get_sharing", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  editSharing({ commit }, id) {
    return services.sharing
      .edit(id)
      .then(response => {
        commit("edit_sharing", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteSharing({ commit }, id) {
    return services.sharing
      .delete(id)
      .then(response => {
        commit("delete_sharing", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
