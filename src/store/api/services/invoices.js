import client from './http';

export default {

  post (invoice) {
    return client.post('/api/v2/invoice', invoice)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll (filter = '') {
    return client.get('/api/v2/invoices?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get (id) {
    return client.get('/api/v2/invoice/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit (invoice) {
    return client.put('/api/v2/invoice/' + invoice.id, invoice)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete (id) {
    return client.delete('/api/v2/invoice/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  addCoupon (params) {
    return client.post('/api/v2/invoice/addcoupon', params)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  removeCoupon (params) {
    return client.post('/api/v2/invoice/removecoupon', params)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}
