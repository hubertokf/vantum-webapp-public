import {services} from './../api'

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  postEmailTask ({
    commit,
  }, params) {
    return services.emails.postTask(params)
      .then((response) =>{
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },

  postIdea ({
    commit,
  }, params) {
    return services.emails.postIdea(params)
      .then((response) =>{
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
