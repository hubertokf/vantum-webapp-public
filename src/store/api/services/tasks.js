import client from './http';

export default {

  post (task) {
    return client.post('/api/v2/task', task)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  run (task) {
    return client.get('/api/v2/task/' + task.id + '/run')
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/task?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/task/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (user) {
    return client.put('/api/v2/task/' + user.id, user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/task/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
