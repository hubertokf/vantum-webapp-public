import client from './http';

export default {

  post (user) {
    return client.post('/api/v2/orthomosaic', user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/orthomosaics?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/orthomosaic/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (orthomosaic) {
    return client.put('/api/v2/orthomosaic/' + orthomosaic.id, orthomosaic)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/orthomosaic/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
