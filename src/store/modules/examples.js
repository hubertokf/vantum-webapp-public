import {services} from './../api'

const state = {
  examplePlans: [],
  exampleProjects: [],
  exampleAlbums: [],
  isExample: false
}

const getters = {
  getExamplePlans: state => state.examplePlans,
  getExampleProjects: state => state.exampleProjects,
  getExampleAlbums: state => state.exampleAlbums,
  getIsExample: state => state.isExample,
}

const mutations = {
  get_exampleplans (state, examplePlans) {
    state.examplePlans = examplePlans
  },
  get_exampleprojects (state, exampleProjectss) {
    state.exampleProjects = exampleProjectss
  },
  get_examplealbums (state, exampleAlbumss) {
    state.exampleAlbums = exampleAlbumss
  },
  set_isexample (state, value) {
    state.isExample = value
  },
}

const actions = {
  setIsExample ({
    commit,
    state
  }, value) {
    commit('set_isexample', value)
  },

  getExampleAlbums ({
    commit,
    state
  }, filter) {
    services.albums.getAll(filter)
      .then((response) => {
        commit('get_examplealbums', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },

  getExampleProjects ({
    commit,
    state
  }, filter) {
    services.projects.getAll(filter)
      .then((response) => {
        commit('get_exampleprojects', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },

  getExamplePlans ({
    commit,
    state
  }, filter) {
    services.plans.getAll(filter)
      .then((response) => {
        commit('get_exampleplans', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
