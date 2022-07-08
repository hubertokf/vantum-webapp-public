import { services } from "./../api";

const state = {
  images: [],
  currentImage: null
};

const getters = {
  getImages: state => state.images,
  getCurrentImage: state => state.currentImage
};

const mutations = {
  post_image(state, image) {
    state.images.push(image);
  },
  get_images(state, images) {
    state.images = images;
  },
  get_image(state, image) {
    state.currentImage = image;
  },
  edit_image(state, currentImage) {
    var index = state.images.findIndex(image => image.id === currentImage.id);
    this._vm.$set(state.images, index, currentImage);

    // state.images.splice(index, 1)
    // state.images.push(image)
  },
  delete_image(state, currentImage) {
    var index = state.images.findIndex(image => image.id === currentImage.id);
    state.images.splice(index, 1);
  }
};

const actions = {
  postImage({ commit, state }, image) {
    return services.image
      .post(image)
      .then(response => {
        commit("post_image", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getImages({ commit, state }, filter) {
    return services.image
      .getAll(filter)
      .then(response => {
        commit("get_images", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getImage({ commit, state }, id) {
    return services.image
      .get(id)
      .then(response => {
        commit("get_image", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  editImage({ commit, state }, id) {
    return services.image
      .edit(id)
      .then(response => {
        commit("edit_image", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  deleteImage({ commit, state }, id) {
    return services.image
      .delete(id)
      .then(response => {
        commit("delete_image", this._vm.$clone(response.data));
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
