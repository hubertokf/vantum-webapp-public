import {
  services
} from "./../api";

const state = {
  annotations: [],
  currentAnnotation: null,
  newAnnotation: null
};

const getters = {
  // getAnnotations: (state, getters, type) => {
  //   return state.annotations.filter(annotation => {
  //     return annotation.type.includes(type)
  //   })
  //   // state.annotations,
  // },
  getAnnotations: state => state.annotations,
  // getCountAnnotations: (state, getters, rootState, rootGetters) => getters.getAnnotations.length,
  // getAnnotations: state => state.annotations,
  // getCountAnnotations: state => state.annotations.length,
  getCurrentAnnotation: state => state.currentAnnotation,
  // getAnnotations: state => state.annotations,
  getNewAnnotation: state => state.newAnnotation
};

const mutations = {
  set_current_annotation(state, annotation) {
    state.currentProject = annotation;
  },
  set_annotations(state, annotations) {
    state.annotations = annotations;
  },
  set_newannotation(state, annotation) {
    state.newAnnotation = annotation;
  },
  post_annotation(state, annotations) {
    // Ajustar
    state.annotations.push(annotations);
  },
  get_annotations(state, annotations) {
    state.annotations = annotations;
  },
  get_annotation(state, annotation) {
    state.currentAnnotation = annotation;
  },
  get_annotation_project(state, annotation) {
    state.annotations = annotation;
  },
  edit_annotation(state, currentAnnotation) {
    var index = state.annotations.findIndex(
      annotation => annotation.id === currentAnnotation.id
    );
    this._vm.$set(state.annotations, index, currentAnnotation);
    // state.annotations.splice(index, 1)
    // state.annotations.push(Annotation)
  },

  delete_annotation(state, annotationId) {
    var index = state.annotations.findIndex(
      annotation => annotation.id === annotationId
    );
    state.annotations.splice(index, 1);
  },

  add_attachment(state, annotation) {
    state.currentAnnotation = annotation;
  },
  edit_attachment(state, annotation) {
    state.currentAnnotation = annotation;
  },
  remove_attachment(state, annotation) {
    state.currentAnnotation = annotation;
  }
};

const actions = {
  addAttachment({
    commit
  }, object) {
    return services.annotations
      .addAttachment(object)
      .then(response => {
        commit("add_attachment", this._vm.$clone(response.data));
        return Promise.resolve(response.data.attachments);
      })
      .catch(error => Promise.reject(error));
  },
  editAttachment({
    commit
  }, object) {
    return services.annotations
      .editAttachment(object)
      .then(response => {
        commit("edit_attachment", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  removeAttachment({
    commit
  }, object) {
    return services.annotations
      .removeAttachment(object)
      .then(response => {
        commit("remove_attachment", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  setCurrentAnnotation({
    commit
  }, annotation) {
    return new Promise((resolve, reject) => {
      commit("set_current_annotation", this._vm.$clone(annotation));
      resolve(annotation);
    });
  },
  setNewAnnotation({
    commit
  }, annotation) {
    return new Promise((resolve, reject) => {
      commit("set_newannotation", this._vm.$clone(annotation));
      resolve(annotation);
    });
  },
  postAnnotation({
    commit
  }, annotation) {
    return services.annotations
      .post(annotation)
      .then(response => {
        commit("post_annotation", this._vm.$clone(response.data));
        commit("set_newannotation", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getAnnotations({
    commit
  }, filter) {
    return services.annotations
      .getAll(filter)
      .then(response => {
        commit("get_annotations", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getAnnotation({
    commit
  }, id) {
    return services.annotations
      .get(id)
      .then(response => {
        commit("get_annotation", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  editAnnotation({
    commit
  }, annotation) {
    return services.annotations
      .edit(annotation)
      .then(response => {
        commit("edit_annotation", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deleteAnnotation({
    commit
  }, id) {
    return services.annotations
      .delete(id)
      .then(response => {
        commit("delete_annotation", id);
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