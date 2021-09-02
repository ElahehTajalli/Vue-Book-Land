// Imports
import _axios from '@/api/axios'
import bignum from 'json-bignum'
class API {
  constructor({ url }) {
    this.url = url
    this.endpoints = {}
  }

  handleSuccess(res) {
    if (res) {
      const { status } = res
      if (status === 200 || status === 201) {
        const responseText = res.request.responseText
        if (responseText) {
          return bignum.parse(responseText)
        }
        return res.data
      }
      if (status === 204) {
        return res
      }
    }
    return null
  }

  createEntity(entity) {
    this.endpoints[entity.name] = this.createBasicCRUDEndpoints(entity)
  }

  createEntities(arrayOfEntity) {
    arrayOfEntity.forEach(this.createEntity.bind(this))
  }

  createBasicCRUDEndpoints({ name }) {
    const endpoints = {}
    const resourceURL = `${this.url}/${name}`
    endpoints.getAll = ({ query } = {}) =>
      _axios.get(resourceURL, { params: query }).then(this.handleSuccess)
    endpoints.getOne = ({ id }) =>
      _axios
        .get(`${resourceURL}${id ? `/${id}/` : ''}`)
        .then(this.handleSuccess)
    endpoints.create = (toCreate) =>
      _axios.post(resourceURL, toCreate).then(this.handleSuccess)
    endpoints.up = (toUpdate) =>
      _axios.put(resourceURL, toUpdate).then(this.handleSuccess)
    endpoints.update = ({ id, toUpdate }) =>
      _axios
        .put(`${resourceURL}${id ? `/${id}` : ''}`, toUpdate)
        .then(this.handleSuccess)
    endpoints.patch = ({ id, toPatch }) =>
      _axios
        .patch(`${resourceURL}${id ? `/${id}` : ''}`, toPatch)
        .then(this.handleSuccess)
    endpoints.patchUser = ({ toPatch }) =>
      _axios.patch(`${resourceURL}`, toPatch).then(this.handleSuccess)
    endpoints.delete = ({ id }) =>
      _axios
        .delete(`${resourceURL}${id ? `/${id}` : ''}`)
        .then(this.handleSuccess)
    endpoints.remove = (toDelete) =>
      _axios.delete(resourceURL, toDelete).then(this.handleSuccess)
    return endpoints
  }
}

export default API
