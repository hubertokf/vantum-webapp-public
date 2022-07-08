import client from './http';

export default {

  post (sharing) {
    return client.post('/api/v2/sharing', sharing)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/sharing?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/sharing/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (sharing) {
    return client.put('/api/v2/sharing/:id' + sharing.id, sharing)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/sharing/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
