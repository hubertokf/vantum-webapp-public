import axios from 'axios'
// import { start } from 'repl';

export default {
  state: {
    isLoadingLists: false,
    mapKey: 0,
    sidebarOpen: true,
    currentProject: null,
    projects: [],
    projectsShare: [],
    albums: [],
    orthomosaics: [],
    tasks: [],
    searchOpen: false,
    currentOrthomosaic: null,
    currentPhotos: [{
        id: 1,
        url: "http://url1",
      },
      {
        id: 2,
        url: "http://url2",
      },
      {
        id: 3,
        url: "http://url3",
      },

    ],
  },

  getters: {
    getMapKey: state => state.mapKey,
    sidebarOpen: state => state.sidebarOpen,
    getProjects2: state => state.projects,
    getCurrentProject2: state => state.currentProject,
    getCurrentOrthomosaic2: state => state.currentOrthomosaic,
    getCurrentPhotos2: state => state.currentPhotos,
    getAlbums2: state => state.albums,
    getDropZoneOptions: state => state.dropzoneOptions,
    getOrthomosaics2: state => state.orthomosaics,
    getTasks2: state => state.tasks,
    getOwner2: state => state.owner,
    getSearchOpen: state => state.searchOpen,
    isLoadingLists: state => state.isLoadingLists,
  },

  mutations: {
    set_isloadinglists(state, value) {
      state.isLoadingLists = value
    },
    toggle_isloadinglists(state) {
      state.isLoadingLists = !state.isLoadingLists
    },
    update_mapkey(state) {
      state.mapKey = Math.floor(Math.random() * 90000) + 10000;
    },
    toggle_sidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    status_dropzone(state) {
      state.autoProcessQueue = !state.autoProcessQueue
    },
    toggle_search(state) {
      state.searchOpen = !state.searchOpen
    },
    update_projects(state) {

      var user = this.getters.getUser
      state.currentOrthomosaic = null
      state.currentProject = null
      state.orthomosaics = []

      axios.get('/api/v2/projects?owner=' + user.id)
        .then(response => {
          state.projects = response.data
        })
        .catch(e => {})

      axios.get('/api/v2/project/sharing?user=' + user.id)
        .then(response => {

          response.data.forEach(function (sharing, index, array) {
            // state.projects.push(sharing)

            var newSharing = sharing
            newSharing.project.owner = newSharing.owner

            state.projects.push(newSharing)

          })
        })
        .catch(e => {})
    },

    add_project(state, project) {
      state.projects.push(project)
    },

    remove_project(state, currentProject) {
      return new Promise((resolve, reject) => {
        axios.delete("/api/v2/project/" + currentProject.id)
          .then(response => {

            //Procura o index do objeto q possui determinado id, removendo da lista
            var index = state.projects.findIndex(project => project.id === currentProject.id);
            state.projects.splice(index, 1);

            this.$notify({
              group: 'global',
              type: 'is-success',
              duration: 2000,
              title: 'Projeto removido'
            });
            resolve(response)
          })
          .catch(e => {
            console.log(e);
            reject(e)
          });
      })
    },

    current_project(state) { // Acessa o servidor do google p baixar as imagens

    },

    update_albums(state) {
      axios.get('/api/v2/albums?project=' + state.currentProject.id)
        .then(response => {
          state.albums = response.data
        })
        .catch(e => {})
    },

    remove_album(state, currentAlbum) {
      var index = state.albums.findIndex(albums => albums.id === currentAlbum.id);
      state.albums.splice(index, 1);
    },

    update_orthomosaic(state, orthomosaics) {
      state.mapKey = Math.floor(Math.random() * 90000) + 10000;
      state.orthomosaics = orthomosaics

      state.currentOrthomosaic = state.orthomosaics[0]
    },

    remove_orthomosaic(state, currentOrthomosaic) {
      var index = state.orthomosaics.findIndex(orthomosaics => orthomosaics.id === currentOrthomosaic.id);
      state.orthomosaics.splice(index, 1);
    },

    select_orthomosaic(state, orthomosaic) {
      state.currentOrthomosaic = orthomosaic
    },

    update_task(state) {
      state.albums.forEach(function (album, index, array) {
        axios.get('/api/v2/task?album=' + album.id)
          .then(response => {
            state.tasks = response.data
          })
          .catch(e => {})
      })
    },

    set_project(state, project) { // Procura na lista de projetos pelo ID
      state.currentProject = project
    },

    remove_sharing(state, currentProject) {
      //Procura o index do objeto q possui determinado id, removendo da lista
      var index = state.projects.findIndex(project => project.id === currentProject.id);
      state.projects.splice(index, 1);
    },

    facebookLogin(state) {

    },
  },

  actions: {
    toggleSearch({
      commit,
      state
    }) {
      commit('toggle_search')
    },
    setIsLoadingLists({
      commit,
      state
    }, value) {
      return new Promise((resolve, reject) => {
        commit('set_isloadinglists', value)
        resolve()
      })
    },
    toggleIsLoadingLists({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('toggle_isloadinglists')
        resolve()
      })
    },
    updateMapKey({
      commit,
      state
    }) {
      commit('update_mapkey')
    },
    toggleSidebar({
      commit,
      state
    }) {
      commit('toggle_sidebar')
    },
    updatedProjects({
      commit,
      state
    }) {
      commit('update_projects')
    },
    statusDropzone({
      commit,
      state
    }) {
      commit('status_dropzone')
    },
    addProject({
      commit,
      state
    }, project) {
      commit('add_project', project)
    },
    removeProject({
      commit,
      state
    }, project) {
      commit('remove_project', project)
    },
    currentProject({
      commit,
      state
    }) { // Verificar os argumentos a passar
      commit('current_project')
    },
    updateAlbums({
      commit,
      state
    }) {
      commit('update_albums')
    },
    removeAlbum({
      commit,
      state
    }, album) {
      commit('remove_album', album)
    },
    updateOrthomosaics({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {

        axios.get('/api/v2/orthomosaics?project=' + state.currentProject.id)
          .then(response => {
            commit('update_orthomosaic', response.data)
            resolve(response.data)
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    selectOrthomosaic({
      commit,
      state
    }, orthomosaic) {
      commit('select_orthomosaic', orthomosaic)
    },
    removeOrthomosaic({
      commit,
      state
    }, orthomosaic) {
      commit('remove_orthomosaic', orthomosaic)
    },
    updateTask({
      commit,
      state
    }) {
      commit('update_task')
    },
    setProject({
      commit,
      state
    }, projectID) {

      return new Promise((resolve, reject) => {
        if (state.projects == []) { // Realiza o AXIOS no DB em busca do projeto com determinado ID
          axios.get('/api/v2/project/' + projectID)
            .then(response => {
              commit('set_project', response.data)
              resolve(state.currentProject)
            })
            .catch(e => {
              reject(e);
            });
        } else {
          var found = false
          state.projects.forEach(function (project) {
            if (project.id == projectID) {
              commit('set_project', project)
              found = true
              resolve(state.currentProject)
            }
          })
          if (!found) {
            axios.get('/api/v2/project/' + projectID)
              .then(response => {
                commit('set_project', response.data)
                resolve(state.currentProject)
              })
              .catch(e => {
                reject(e);
              });
          }
        }
      })
    },
    removeSharing({
      commit,
      state
    }, project) {
      return new Promise((resolve, reject) => {
        axios.delete("/api/v2/project/sharing/" + project.id)
          .then(response => {
            commit('remove_sharing', project)
            resolve(response)

          })
          .catch(e => {
            reject(e)
          });
      })
    },

  }
}