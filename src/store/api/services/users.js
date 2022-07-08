import client from './http';

export default {

  post(user) {
    return client.post('/api/v2/user', user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll(filter = '') {
    return client.get('/api/v2/users?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get(id) {
    return client.get('/api/v2/user/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  getEmails(email) {
    return client.get('/api/v2/user/emails?' + email)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit(user) {
    return client.put('/api/v2/user/' + user.id, user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete(id) {
    return client.delete('/api/v2/user/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  subscribePlan(req) {
    return client.post('/api/v2/subscribeplan/' + req.id, req)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  changePassword(req) {
    return client.post('/api/v2/changepassword/' + req.id, req)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  changeEmail(req) {
    return client.post('/api/v2/changeemail/' + req.id, req)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  confirmEmail(token) {
    return client.get('/api/v2/email/confirm?token=' + token)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },



}