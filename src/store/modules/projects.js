import { services } from "./../api";

const state = {
  projects: [],
  currentProject: null,
  newProject: null
};

const getters = {
  getProjects: (state, getters, rootState, rootGetters) => {
    return state.projects.filter(project => {
      return project.name
        .toLowerCase()
        .includes(rootGetters.getSearchTerm.toLowerCase());
    });
    // state.projects,
  },
  // getAllPlans: (state, getters, rootState, rootGetters) => {
  //   return state.projects.plans.filter(plan => {
  //     return plan.name
  //       .toLowerCase()
  //       .includes(rootGetters.getSearchTerm.toLowerCase());
  //   });
  // },
  getCountProjects: (state, getters, rootState, rootGetters) =>
    getters.getProjects.length,
  // getCountProjects: state => state.projects.length,
  getCurrentProject: state => state.currentProject,
  getNewProject: state => state.newProject
};

const mutations = {
  set_current_project(state, project) {
    state.currentProject = project;
  },
  set_newproject(state, project) {
    state.newProject = project;
  },
  post_project(state, project) {
    // Ajustar
    state.projects.push(project);
  },
  get_projects(state, projects) {
    state.projects = projects;
  },
  get_project(state, project) {
    state.currentProject = project;
  },
  edit_project(state, currentProject) {
    var index = state.projects.findIndex(
      project => project.id === currentProject.id
    );
    this._vm.$set(state.projects, index, currentProject);
    // state.projects.splice(index, 1)
    // state.projects.push(project)
  },
  delete_project(state, projectId) {
    var index1 = state.projects.findIndex(project => project.id === projectId);
    if (state.currentProject.projects) {
      var index2 = state.currentProject.projects.findIndex(
        project => project.id === projectId
      );
      state.currentProject.projects.splice(index2, 1);
    }
    state.projects.splice(index1, 1);
  },

  insert_into_project(state, newProject) {
    state.currentProject.projects.push(newProject);
    let index = state.projects.findIndex(
      project => project.id === newProject._id
    );
    state.projects[index].parent = state.currentProject._id;
  },
  insert_plan_into_project(state, newPlan) {
    //Fixing to newProject don't have duplicated plans
    if (state.currentProject.plans) {
      let inside = state.currentProject.plans.findIndex(
        plan => plan._id === newPlan._id
      );
      if (inside === -1) {
        state.currentProject.plans.push(newPlan);
      }
    }
  },

  remove_project_from_parent(state, projectToDeleteId) {
    state.projects.forEach(project => {
      if (project.parent === projectToDeleteId) {
        project.parent = null;
      }
    });
    if (state.currentProject.projects) {
      state.currentProject.projects.forEach(project => (project.parent = null));
    }
  },

  remove_from_project(state, object) {
    let index = state.currentProject.projects.findIndex(
      project => project.id === object.id
    );
    state.currentProject.projects.splice(index, 1);
    index = state.projects.findIndex(project => project.id === object._id);
    state.projects[index].parent = null;
  },
  remove_plan_from_project(state, object) {
    let index = state.currentProject.plans.findIndex(
      plan => plan.id === object._id
    );
    state.currentProject.plans.splice(index, 1);
  }
};

const actions = {
  setCurrentProject({ commit }, project) {
    return new Promise((resolve, reject) => {
      commit("set_current_project", this._vm.$clone(project));
      resolve(project);
    });
  },
  setNewProject({ commit }, project) {
    return new Promise((resolve, reject) => {
      commit("set_newproject", this._vm.$clone(project));
      resolve(project);
    });
  },
  postProject({ commit }, project) {
    return services.projects
      .post(project)
      .then(response => {
        commit("post_project", this._vm.$clone(response.data));
        commit("set_newproject", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getProjects({ commit }, filter) {
    return services.projects
      .getAll(filter)
      .then(response => {
        commit("get_projects", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getProject({ commit }, id) {
    return services.projects
      .get(id)
      .then(response => {
        commit("get_project", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  editProject({ commit }, project) {
    return services.projects
      .edit(project)
      .then(response => {
        commit("edit_project", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteProject({ commit }, id) {
    return services.projects
      .delete(id)
      .then(response => {
        commit("delete_project", id);
        commit("remove_project_from_parent", id);
        commit("remove_project_from_plan", id, { root: true });
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  insertIntoProject({ commit }, request) {
    return services.projects
      .insertIntoProject(request)
      .then(response => {
        commit("insert_into_project", request.project);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  insertPlanIntoProject({ commit }, request) {
    return services.projects
      .insertPlanIntoProject(request)
      .then(response => {
        commit("insert_plan_into_project", request.plan);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  removeFromProject({ commit }, object) {
    return services.projects
      .removeFromProject(object)
      .then(response => {
        commit("remove_from_project", object);
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  removePlanFromProject({ commit }, plan) {
    return services.projects
      .removePlanFromProject(plan)
      .then(response => {
        commit("remove_plan_from_project", plan);
        commit("remove_project_from_plan", plan.project, { root: true });
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
