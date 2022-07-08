import { services } from "./../api";

const state = {
  company: [],
  currentCompany: null
};

const getters = {
  getCompanies: state => state.company,
  getCurrentCompany: state => state.currentCompany
};

const mutations = {
  post_company(state, company) {
    // Ajustar
    state.company.push(company);
  },
  get_company(state, company) {
    state.currentCompany = company;
  },
  get_companies(state, companies) {
    state.company = companies;
  },
  set_company(state, company) {
    state.currentCompany = company;
  },
  edit_company(state, currentCompany) {
    var index = state.company.findIndex(
      company => company.id === currentCompany.id
    );
    this._vm.$set(state.company, index, currentCompany);

    // state.company.splice(index, 1)
    // state.company.push(company)
  },

  delete_company(state, currentCompany) {
    var index = state.company.findIndex(
      company => company.id === currentCompany.id
    );
    state.company.splice(index, 1);
  },
  set_company_color1(state, color) {
    state.currentCompany.colors.color1 = color;
  },
  set_company_color2(state, color) {
    state.currentCompany.colors.color2 = color;
  },
  set_company_color3(state, color) {
    state.currentCompany.colors.color3 = color;
  },
  set_company_color4(state, color) {
    state.currentCompany.colors.color4 = color;
  }
};

const actions = {
  postCompany({ commit, state }, company) {
    return services.companies
      .post(company)
      .then(response => {
        commit("post_company", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getCompanies({ commit, state }, filter) {
    return services.companies
      .getAll(filter)
      .then(response => {
        commit("get_companies", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getCompany({ commit, state }, filter) {
    return services.companies
      .getAll(filter)
      .then(response => {
        commit("get_company", this._vm.$clone(response.data[0]));
        return Promise.resolve(response.data[0]);
      })
      .catch(error => Promise.reject(error));
  },
  // getCompany ({
  //   commit,
  //   state
  // }, id) {
  //   return services.companies.get(id)
  //     .then((response) => {
  //       commit('get_company', this._vm.$clone(response.data))
  //       return Promise.resolve(response.data)
  //     })
  //     .catch((error) => Promise.reject(error))
  // },

  editCompany({ commit, state }, company) {
    return services.companies
      .edit(company)
      .then(response => {
        commit("set_company", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  putCompany({ commit, state }) {
    return services.companies
      .edit(state.currentCompany)
      .then(response => {
        commit("set_company", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deleteCompany({ commit, state }, id) {
    return services.companies
      .delete(id)
      .then(response => {
        commit("delete_company", this._vm.$clone(response.data));
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
