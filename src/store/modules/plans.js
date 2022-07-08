import { services } from "./../api";

const state = {
  plans: [],
  currentPlan: null,
  newPlan: null
};

const getters = {
  getPlans: (state, getters, rootState, rootGetters) => {
    return state.plans.filter(plan => {
      return plan.name
        .toLowerCase()
        .includes(rootGetters.getSearchTerm.toLowerCase());
    });
    // state.plans,
  },
  // getPlans: state => state.plans,
  getCountPlans: (state, getters, rootState, rootGetters) =>
    getters.getPlans.length,
  getCurrentPlan: state => state.currentPlan,
  getNewPlan: state => state.newPlan
};

const mutations = {
  set_newplan(state, plan) {
    state.newPlan = plan;
  },
  set_currentplan(state, plan) {
    state.currentPlan = plan;
  },
  post_plan(state, plans) {
    // Ajustar
    state.plans.push(plans);
  },
  get_plans(state, plans) {
    state.plans = plans;
  },
  get_plan(state, plan) {
    state.currentPlan = plan;
  },
  get_plan_project(state, plan) {
    state.plans = plan;
  },
  edit_plan(state, currentPlan) {
    var index = state.plans.findIndex(plan => plan.id === currentPlan.id);
    this._vm.$set(state.plans, index, currentPlan);
  },
  delete_plan(state, planId) {
    var index = state.plans.findIndex(plan => plan.id === planId);
    state.plans.splice(index, 1);
  },
  remove_project_from_plan(state, projectToDeleteId) {
    state.plans.forEach(plan => {
      if (plan.project) {
        if (plan.project._id == projectToDeleteId) {
          plan.project = null;
        }
      }
    });
  },
  insert_project_into_plan(state, object) {
    state.plans.forEach(plan => {
      if (plan._id == object.planId) {
        plan.project = object.projectId;
      }
    });
  }
};

const actions = {
  setCurrentPlan({ commit }, plan) {
    return new Promise((resolve, reject) => {
      commit("set_currentplan", this._vm.$clone(plan));
      resolve(plan);
    });
  },
  setNewPlan({ commit }, plan) {
    return new Promise((resolve, reject) => {
      commit("set_newplan", this._vm.$clone(plan));
      resolve(plan);
    });
  },
  postPlan({ commit }, plan) {
    return services.plans
      .post(plan)
      .then(response => {
        commit("post_plan", this._vm.$clone(response.data));
        commit("set_newplan", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getPlans({ commit }, filter) {
    return services.plans
      .getAll(filter)
      .then(response => {
        commit("get_plans", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getPlan({ commit }, id) {
    return services.plans
      .get(id)
      .then(response => {
        commit("get_plan", this._vm.$clone(response.data));
        commit("set_annotations", this._vm.$clone(response.data.annotations));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  editPlan({ commit }, plan) {
    return services.plans
      .edit(plan)
      .then(response => {
        commit("edit_plan", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deletePlan({ commit }, id) {
    return services.plans
      .delete(id)
      .then(response => {
        commit("delete_plan", id);
        // commit("remove_plan_from_project",,{root:true})
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  insertProjectIntoPlan({ commit }, object) {
    return services.plans
      .insertProjectIntoPlan(object)
      .then(response => {
        commit("insert_project_into_plan", object);
        // commit("remove_plan_from_project",,{root:true})
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
