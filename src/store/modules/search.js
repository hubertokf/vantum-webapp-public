import {services} from './../api'

const state = {
  searchTerm: ""
}

const getters = {
  getSearchTerm: state => state.searchTerm,
}

const mutations = {
  set_search (state, searchTerm) { // Ajustar
    state.searchTerm = searchTerm
  },
}

const actions = {
  search ({
    commit
  }, searchTerm){
    commit('set_search', searchTerm)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
