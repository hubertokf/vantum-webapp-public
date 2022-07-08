import client from './http';

export default {
  post (geometry) {
    return client.post('/api/v2/geometry', geometry)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/geometrys?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  get (id) {
    return client.get('/api/v2/geometry/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  edit (geometry) {
    return client.put('/api/v2/geometry/' + geometry.id, geometry)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete (id) {
    return client.delete('/api/v2/geometry/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
