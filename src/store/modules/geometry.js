import { services } from "./../api";

const state = {
  geometry: [],
  currentGeometry: null
};

const getters = {
  getGeometrys: state => state.geometry,
  getCurrentGeometry: state => state.currentgeometry
};

const mutations = {
  post_geometry(state, geometry) {
    // Ajustar
    state.geometry.push(geometry);
  },
  get_geometry(state, geometry) {
    state.currentGeometry = geometry;
  },
  get_geometrys(state, geometrys) {
    state.geometry = geometrys;
  },
  edit_geometry(state, currentGeometry) {
    var index = state.geometry.findIndex(
      geometry => geometry.id === currentGeometry.id
    );
    this._vm.$set(state.geometry, index, currentGeometry);

    // state.geometry.splice(index, 1)
    // state.geometry.push(geometry)
  },

  delete_geometry(state, currentGeometry) {
    var index = state.geometry.findIndex(
      geometry => geometry.id === currentGeometry.id
    );
    state.geometry.splice(index, 1);
  }
};

const actions = {
  postGeometry({ commit, state }, geometry) {
    return services.geometry
      .post(geometry)
      .then(response => {
        commit("post_geometry", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getGeometrys({ commit, state }, filter) {
    return services.geometry
      .getAll(filter)
      .then(response => {
        commit("get_geometrys", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getGeometry({ commit, state }, id) {
    return services.geometry
      .get(id)
      .then(response => {
        commit("get_geometry", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  editGeometry({ commit, state }, geometry) {
    return services.geometry
      .edit(geometry)
      .then(response => {
        commit("edit_geometry", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deleteGeometry({ commit, state }, id) {
    return services.geometry
      .delete(id)
      .then(response => {
        commit("delete_geometry", this._vm.$clone(response.data));
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
