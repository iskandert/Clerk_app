import { devUrl } from '../config'
import axios from 'axios'
import store from '../store'

export default {
  getData({ col, params }) {
    return axios.get(`${devUrl}/api/${col}`, { params }).then((response) => response.data)
  },
  deleteData({ col, params }) {
    return axios.delete(`${devUrl}/api/${col}`, params).then((response) => response.data)
  },
}
