import { services } from "./../api";

const state = {
  professional: [],
  currentProfessional: null
};

const getters = {
  getProfessionals: state => state.professional,
  getCurrentProfessional: state => state.currentprofessional
};

const mutations = {
  post_professional(state, professional) {
    // Ajustar
    state.professional.push(professional);
  },
  get_professional(state, professional) {
    state.currentProfessional = professional;
  },
  get_professionals(state, professionals) {
    state.professional = professionals;
  },
  edit_professional(state, currentProfessional) {
    var index = state.professional.findIndex(
      professional => professional.id === currentProfessional.id
    );
    state.professional[index] = currentProfessional;
    this._vm.$set(state.professional, index, currentProfessional);

    // state.professional.splice(index, 1)
    // state.professional.push(professional)
  },

  delete_professional(state, currentProfessional) {
    var index = state.professional.findIndex(
      professional => professional.id === currentProfessional.id
    );
    state.professional.splice(index, 1);
  }
};

const actions = {
  postProfessional({ commit, state }, professional) {
    return services.professionals
      .post(professional)
      .then(response => {
        commit("post_professional", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getProfessionals({ commit, state }, filter) {
    return services.professionals
      .getAll(filter)
      .then(response => {
        commit("get_professionals", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getProfessional({ commit, state }, id) {
    return services.professionals
      .get(id)
      .then(response => {
        commit("get_professional", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  editProfessional({ commit, state }, professional) {
    return services.professionals
      .edit(professional)
      .then(response => {
        commit("edit_professional", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deleteProfessional({ commit, state }, id) {
    return services.professionals
      .delete(id)
      .then(response => {
        commit("delete_professional", this._vm.$clone(response.data));
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
