import client from './http';

export default {

  login (user) {
    return client.post('/api/v2/login', user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  checktoken (token) {
    return client.post('/api/v2/checktoken', token)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  logout () {
    return client.post('/api/v2/logout')
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  register (user) {
    return client.post('/api/v2/user', user)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  facebookLogin (facebookUser) {
    return client.post('/api/v2/facebooklogin', facebookUser)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
}
