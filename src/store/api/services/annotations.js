import client from './http';

export default {

  post(annotation) {
    return client.post('/api/v2/annotation', annotation)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  getAll(filter = '') {
    return client.get('/api/v2/annotations?' + filter)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  get(id) {
    return client.get('/api/v2/annotation/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  getannotationProject(project) {
    return client.get('/api/v2/annotations?project=' + project)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  edit(annotation) {
    return client.put('/api/v2/annotation/' + annotation.id, annotation)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  delete(id) {
    return client.delete('/api/v2/annotation/' + id)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  addAttachment({
    annotation,
    attachment
  }) {
    return client.post('/api/v2/annotation/' + annotation._id + '/attachment', attachment)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  editAttachment({
    annotation,
    attachment
  }) {
    return client.put('/api/v2/annotation/' + annotation._id + '/attachment', attachment)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },

  removeAttachment({
    annotation,
    attachment
  }) {
    return client.delete('/api/v2/annotation/' + annotation._id + '/attachment', {
        data: attachment
      })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }

}