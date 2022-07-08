import client from './http';

export default {

  post (image) {
    return client.post('/api/v2/image', image)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/images?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/image/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (image) {
    return client.put('/api/v2/image/' + image.id, image)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/image/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
