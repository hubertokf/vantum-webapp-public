import client from './http';

export default {
  post (email) {
    return client.post('/api/v2/email', email)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  postTask(params) {
    // console.log(params)
    return client.post('/api/v2/deliver/contactFormVantumTask', params)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/emails?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  get (id) {
    return client.get('/api/v2/email/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  edit (email) {
    return client.put('/api/v2/email/' + email.id, email)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete (id) {
    return client.delete('/api/v2/email/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  postIdea (idea) {
    return client.post('/api/v2/deliver/contactcampaign', idea)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}
