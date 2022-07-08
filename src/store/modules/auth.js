import axios from 'axios'
import {services} from './../api'

export default {
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}

  },

  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getUser: state => state.user
  },

  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
    },
    auth_error(state) {
      state.status = 'error'
    },
    edit_user (state, user) {
      state.user = user
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
  },

  actions: {
    login({
      commit
    }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        return services.auth.login(user)
          .then((response) =>{

            const token = response.data.token
            const user = response.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', {
              token,
              user
            })

            resolve(response.data)
          })
          .catch((error) => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(error)
          })
      })
    },
    loginAsUser({
      commit
    }, token) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        return services.auth.checktoken(token)
          .then((response) =>{
            const token = response.data.token
            const adminUser = response.data.adminUser
            const user = response.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', {
              user,
              adminUser,
              token
            })
            resolve(response.data)
          })
          .catch((error) => reject(error))
      })
    },
    editLoggedUser ({
      commit,
      state
    }, user) {
      return new Promise((resolve, reject) => {
        return services.users.edit(user)
        .then((response) => {
          commit('edit_user', response.data)
          resolve(response.data)
        })
        .catch((error) => reject(error))
      })
    },
    facebookLogin({
      commit,
      state
    }, facebookUser) {
      return new Promise((resolve, reject) => {
        return services.auth.logout({
          id: facebookUser.id,
          name: facebookUser.name,
          email: facebookUser.email
        })
          .then((response) =>{
            const token = response.data.token
            const user = response.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', {
              token,
              user
            })
            resolve(response.data)
          })
          .catch((error) => reject(error))

      })
    },
    register({
      commit
    }, user) {
      return new Promise((resolve, reject) => {
        return services.auth.register(user)
          .then((response) => {
            if (response.data.message == "User already registered") {
              reject(response)
            } else if (response.data.message == "User registered") {
              resolve(response.data)

              const token = response.data.token
              const user = response.data.user
              localStorage.setItem('token', token)
              axios.defaults.headers.common['Authorization'] = token
              commit('auth_success', {
                token,
                user
              })
            }

            resolve(response.data)
          })
          .catch((error) => {
            commit('auth_error', error)
            localStorage.removeItem('token')
            reject(error)
          })

      })
    },

    logout({
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        return services.auth.logout()
          .then((response) =>{
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
            resolve(response.data)
          })
          .catch((error) => reject(error))
      })
    }
  }
}