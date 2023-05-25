import { devUrl } from '../config'
import axios from 'axios'
import store from '../store'

export default {
  async login(credentials) {
    try {
      const resp = await axios.get(`${devUrl}/api/auth/login`, credentials)
      // axios.defaults.headers.common['Authorization'] = resp.data.data.token
      return resp.data
    } catch (e) {
      throw e
    }
  },
  // async workFlow() {
  //   try {
  //     const resp = await axios.get(`${devUrl}/api/workflow`)
  //     return resp
  //   } catch (e) {
  //     throw e
  //   }
  // },
  // async loadClients(body) {
  //   try {
  //     const resp = await axios.post(`${devUrl}/api/loadclients`, body, { headers: { 'Content-Type': 'multipart/form-data' } })
  //     return resp
  //   } catch (e) {
  //     throw e
  //   }
  // },
  getData({ col, params }) {
    return axios
      .get(`${devUrl}/api/${col}`, {
        params,
        headers: {
          Authorization: store.getters.isLoggedIn,
        },
      })
      .then((response) => response.data)
  },
  // createOrEditEntity({ col, method, payload, id = '', welcome, test, headers }) {
  //   const urlConf = welcome ? { urlTail: '/users', id: payload.companyId } : { urlTail: '', id: id }
  //   // if (test) return axios[method](`https://webhook.site/70329d0a-9473-4f63-8d87-cdc0a11e8d34`, payload)
  //   //   .then(response => response.data)
  //   const dataNConfig = headers ? [payload, { headers }] : [payload]
  //   return axios[method](`${devUrl}/api/${col}/${urlConf.id}${urlConf.urlTail}`, ...dataNConfig).then((response) => response.data)
  // },
  // updateEntityField({ col, payload, id = '', field }) {
  //   return axios.put(`${devUrl}/api/${col}/${id}/${field}`, payload).then((response) => response.data)
  // },
  // updateEntitiesField({ col, body, field, params }) {
  //   return axios.put(`${devUrl}/api/${col}/${field}`, body, { params: params }).then((response) => response.data)
  // },
  // deleteEntity({ col, id, data }) {
  //   return axios.delete(`${devUrl}/api/${col}/${id}`, data).then((response) => response.data)
  // },
  // getFile({ col, params }) {
  //   return axios.get(`${devUrl}/api/${col}/export`, { responseType: 'blob', params: params }).then((response) => response.data)
  // },
}
