import client from './http';

export default {
  post (professional) {
    return client.post('/api/v2/professional', professional)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/professionals?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  get (id) {
    return client.get('/api/v2/professional/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  edit (professional) {
    return client.put('/api/v2/professional/' + professional.id, professional)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete (id) {
    return client.delete('/api/v2/professional/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
