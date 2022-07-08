import client from './http';

export default {
  post (company) {
    return client.post('/api/v2/company', company)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/companies?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  get (id) {
    return client.get('/api/v2/company/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  edit (company) {
    return client.put('/api/v2/company/' + company.id, company)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete (id) {
    return client.delete('/api/v2/company/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
