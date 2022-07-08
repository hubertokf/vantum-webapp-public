import client from './http';

export default {

  post (album) {
    return client.post('/api/v2/album', album)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/albums?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/album/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  getAlbumProject (project) {
    return client.get('/api/v2/albums?project=' + project)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (album) {
    return client.put('/api/v2/album/' + album.id, album)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/album/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
