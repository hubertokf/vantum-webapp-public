import { services } from "./../api";

const state = {
  albums: [],
  currentAlbum: null,
  newAlbum: null
};

const getters = {
  getAlbums: (state, getters, rootState, rootGetters) => {
    return state.albums.filter(album => {
      return album.name
        .toLowerCase()
        .includes(rootGetters.getSearchTerm.toLowerCase());
    });
    // state.albums,
  },
  getCountAlbums: (state, getters, rootState, rootGetters) =>
    getters.getAlbums.length,
  // getAlbums: state => state.albums,
  // getCountAlbums: state => state.albums.length,
  getCurrentAlbum: state => state.currentAlbum,
  getNewAlbum: state => state.newAlbum
};

const mutations = {
  set_newalbum(state, album) {
    state.newAlbum = album;
  },
  post_album(state, albums) {
    // Ajustar
    state.albums.push(albums);
  },
  get_albums(state, albums) {
    state.albums = albums;
  },
  get_album(state, album) {
    state.currentAlbum = album;
  },
  get_album_project(state, album) {
    state.albums = album;
  },
  edit_album(state, currentAlbum) {
    var index = state.albums.findIndex(album => album.id === currentAlbum.id);
    this._vm.$set(state.albums, index, currentAlbum);

    // state.albums.splice(index, 1)
    // state.albums.push(Album)
  },

  delete_album(state, albumId) {
    var index = state.albums.findIndex(album => album.id === albumId);
    state.albums.splice(index, 1);
  }
};

const actions = {
  setNewAlbum({ commit }, album) {
    return new Promise((resolve, reject) => {
      commit("set_newalbum", this._vm.$clone(album));
      resolve(album);
    });
  },
  postAlbum({ commit }, album) {
    return services.albums
      .post(album)
      .then(response => {
        commit("post_album", this._vm.$clone(response.data));
        commit("set_newalbum", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getAlbums({ commit }, filter) {
    return services.albums
      .getAll(filter)
      .then(response => {
        commit("get_albums", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },
  getAlbum({ commit }, id) {
    return services.albums
      .get(id)
      .then(response => {
        commit("get_album", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  editAlbum({ commit }, album) {
    return services.albums
      .edit(album)
      .then(response => {
        commit("edit_album", this._vm.$clone(response.data));
        return Promise.resolve(response.data);
      })
      .catch(error => Promise.reject(error));
  },

  deleteAlbum({ commit }, id) {
    return services.albums
      .delete(id)
      .then(response => {
        commit("delete_album", id);
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
