import { services } from "./../api";

const state = {
  tasks: [],
  currentTask: null,
  newTask: null
};

const getters = {
  getTasks: state => state.tasks,
  getCurrentTask: state => state.currentTask,
  getNewTask: state => state.newTask
};

const mutations = {
  set_newtask(state, task) {
    state.newTask = task;
  },
  post_task(state, task) {
    // Ajustar
    // console.log('++++---', task)
    state.tasks.push(task);
    state.newTask = task;
  },
  get_run(state, task) {
    console.log(task);
  },
  get_tasks(state, tasks) {
    state.tasks = tasks;
  },
  get_task(state, task) {
    state.currentTask = task;
  },
  edit_task(state, currentTask) {
    var index = state.tasks.findIndex(task => task.id === currentTask.id);
    this._vm.$set(state.tasks, index, currentTask);
  },
  delete_task(state, currentTask) {
    var index = state.tasks.findIndex(task => task.id === currentTask.id);
    state.tasks.splice(index, 1);
  }
};

const actions = {
  setNewTask({ commit }, task) {
    return new Promise((resolve, reject) => {
      commit("set_newtask", this._vm.$clone(task));
      resolve(task);
    });
  },
  postTask({ commit, state }, task) {
    return services.tasks
      .post(task)
      .then(response => {
        commit("post_task", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getRun({ commit, state }, task) {
    return services.tasks
      .run(task)
      .then(response => {
        commit("get_run", this._vm.$clone(response.data));
      })
      .catch(error => {
        console.error(error);
      });
  },
  getTasks({ commit, state }, filter) {
    return services.tasks
      .getAll(filter)
      .then(response => {
        commit("get_tasks", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getTask({ commit, state }, id) {
    return services.tasks
      .get(id)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error));
  },
  editTask({ commit, state }, id) {
    return services.tasks
      .edit(id)
      .then(response => {
        commit("edit_task", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteTask({ commit, state }, id) {
    return services.tasks
      .delete(id)
      .then(response => {
        commit("delete_task", this._vm.$clone(response.data));
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
