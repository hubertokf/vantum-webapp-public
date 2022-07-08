import { services } from "./../api";

const state = {
  orthomosaics: [],
  currentOrthomosaic: null,
  activeOrthomosaics: [],
  newOrthomosaic: null
};

const getters = {
  getOrthomosaics: state => state.orthomosaics,
  getSelectedOrthomosaics: (state, getters, rootState, rootGetters) => {
    return state.orthomosaics.filter(orthomosaics => {
      return orthomosaics.selected == true;
    });
  },
  getCurrentOrthomosaic: state => state.currentOrthomosaic,
  getNewOrthomosaic: state => state.newOrthomosaic,
  getActiveOrthomosaics: state => state.activeOrthomosaics
};

const mutations = {
  clear_orthomosaic_state(state, ref) {
    state.orthomosaics = [];
    state.activeOrthomosaics = [];
    state.newOrthomosaic = null;
    state.currentOrthomosaic = null;
  },
  toogle_orthomosaic(state, ref) {
    var index = state.orthomosaics.findIndex(
      orthomosaic => orthomosaic.id === ref.id
    );
    state.orthomosaics[index].selected = !state.orthomosaics[index].selected;
    state.orthomosaics[index].opacity = ref.opacity;
  },
  set_activeorthomosaics(state, ref) {
    var index = state.activeOrthomosaics.findIndex(
      orthomosaic => orthomosaic.id === ref.id
    );
    if (index == -1) {
      state.activeOrthomosaics.push(ref);
    } else {
      state.activeOrthomosaics.splice(index, 1);
    }
  },
  set_orthomosaics(state, orthomosaics) {
    state.orthomosaics = orthomosaics;
  },
  set_current(state, orthomosaic) {
    state.currentOrthomosaic = orthomosaic;
  },
  set_neworthomosaic(state, orthomosaic) {
    state.newOrthomosaic = orthomosaic;
  },
  post_orthomosaic(state, orthomosaic) {
    state.orthomosaics.push(orthomosaic);
    // state.newOrthomosaic = orthomosaic
  },
  get_orthomosaics(state, orthomosaics) {
    state.orthomosaics = orthomosaics;
  },
  get_orthomosaic(state, orthomosaic) {
    state.currentOrthomosaic = orthomosaic;
  },
  edit_orthomosaic(state, currentOrthomosaic) {
    var index = state.orthomosaics.findIndex(
      orthomosaic => orthomosaic.id === currentOrthomosaic.id
    );
    this._vm.$set(state.orthomosaics, index, currentOrthomosaic);

    // state.Orthomosaics.splice(index, 1)
    // state.Orthomosaics.push(Orthomosaic)
  },
  delete_Orthomosaic(state, currentOrthomosaic) {
    var index = state.orthomosaics.findIndex(
      orthomosaic => orthomosaic.id === currentOrthomosaic.id
    );
    state.orthomosaics.splice(index, 1);
  }
};

const actions = {
  clearOrthomosaics({ commit }) {
    return new Promise((resolve, reject) => {
      commit("clear_orthomosaic_state");
      resolve();
    });
  },
  setActiveOrthomosaics({ commit }, orthomosaic) {
    return new Promise((resolve, reject) => {
      commit("set_activeorthomosaics", orthomosaic);
      resolve(orthomosaic);
    });
  },
  toggleOrthomosaic({ commit }, orthomosaic) {
    return new Promise((resolve, reject) => {
      commit("toogle_orthomosaic", orthomosaic);
      resolve(orthomosaic);
    });
  },
  setOrthomosaics({ commit }, orthomosaics) {
    return new Promise((resolve, reject) => {
      commit("set_orthomosaics", orthomosaics);
      resolve(orthomosaics);
    });
  },
  setCurrentOrthomosaic({ commit }, orthomosaic) {
    return new Promise((resolve, reject) => {
      commit("set_current", this._vm.$clone(orthomosaic));
      resolve(orthomosaic);
    });
  },
  setNewOrthomosaic({ commit }, orthomosaic) {
    return new Promise((resolve, reject) => {
      commit("set_neworthomosaic", this._vm.$clone(orthomosaic));
      resolve(orthomosaic);
    });
  },
  postOrthomosaic({ commit, state }, orthomosaic) {
    return services.orthomosaics
      .post(orthomosaic)
      .then(response => {
        commit("post_orthomosaic", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getOrthomosaics({ commit, state }, filter) {
    return services.orthomosaics
      .getAll(filter)
      .then(response => {
        commit("get_orthomosaics", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getOrthomosaic({ commit, state }, id) {
    return services.orthomosaics
      .get(id)
      .then(response => {
        commit("get_orthomosaic", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  editOrthomosaic({ commit, state }, orthomosaic) {
    return services.orthomosaics
      .edit(orthomosaic)
      .then(response => {
        commit("edit_orthomosaic", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteOrthomosaic({ commit, state }, id) {
    return services.orthomosaics
      .delete(id)
      .then(response => {
        commit("delete_orthomosaic", this._vm.$clone(response.data));
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
