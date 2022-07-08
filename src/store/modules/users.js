import { services } from "./../api";

const state = {
  users: [],
  currentUser: null
};

const getters = {
  getUsers: state => state.users,
  getCurrentUser: state => state.currentUser
};

const mutations = {
  post_user(state, user) {
    // Ajustar
    state.users.push(user);
  },
  get_users(state, users) {
    state.users = users;
  },
  get_user(state, user) {
    state.currentUser = user;
  },
  edit_User(state, user) {
    var index = state.users.findIndex(user => user.id === users.id);
    this._vm.$set(state.users, index, user);
  },
  delete_User(state, User) {
    var index = state.users.findIndex(user => user.id === users.id);
    state.users.splice(index, 1);
  }
};

const actions = {
  confirmEmail({ commit, state }, token) {
    return services.users
      .confirmEmail(token)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  subscribePlan({ commit, state }, req) {
    return services.users
      .subscribePlan(req)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  changePassword({ commit, state }, req) {
    return services.users
      .changePassword(req)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  changeEmail({ commit, state }, req) {
    return services.users
      .changeEmail(req)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  postUser({ commit, state }, user) {
    return services.users
      .post(user)
      .then(response => {
        commit("post_user", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getUsers({ commit, state }, filter) {
    return services.users
      .getAll(filter)
      .then(response => {
        commit("get_users", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getUser({ commit, state }, id) {
    return services.users
      .get(id)
      .then(response => {
        commit("get_user", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getEmails({ commit, state }, email) {
    return services.users
      .getEmails(email)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  editUser({ commit, state }, user) {
    return services.users
      .edit(user)
      .then(response => {
        commit("edit_user", response.data);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteUser({ commit, state }, id) {
    return services.users
      .delete(id)
      .then(response => {
        commit("delete_user", response.data);
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
