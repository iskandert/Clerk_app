import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import api from '../services/api'
import axios from 'axios'
import { setValueAfterDelay } from '../services/utils'

const getDefaultState = () => {
  return {
    token: '',
    isExpired: false,
    expiringTimeout: undefined,
    user: {},
    loadState: false,
    isMobileSize: false,
    meta: [],
    data: {},
    // viewportSize: getInitWidth(layoutSizing), // xs, sm, md, lg, xl
  }
}

export default createStore({
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: (state) => {
      return state.token
    },
    getUser: (state) => {
      return state.user
    },
    getLoadState: (state) => {
      return state.loadState
    },
    getWindowSizeState: (state) => {
      return state.isMobileSize
    },
    getList: (state) => (col) => {
      let colParts = col.split('/')
      if (colParts.length === 2) return state[colParts[0]][colParts[1]]
      return state[col]
    },
    // getViewportSize: (state) => (size) => {
    //   if (typeof size === 'string') {
    //     return state.viewportSize === size
    //   }
    //   return size.some((curr) => state.viewportSize === curr)
    // },
  },
  mutations: {
    SET_TOKEN: (state, { token, saved_in, expires_in }) => {
      state.token = token
      state.saved_in = saved_in
      state.expires_in = expires_in // prod
      // state.expires_in = 65 // test
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_SUP_DATA: (state, { f, data }) => {
      let colParts = f.split('/')
      if (colParts.length === 2) return (state[colParts[0]][colParts[1]] = data)
      state[f] = data
    },
    SET_ALL_DATA: (state, { data }) => {
      state.data = data
    },
    SET_LOAD_STATE: (state, value) => {
      state.loadState = value
    },
    RESET: (state) => {
      clearTimeout(state.expiringTimeout)
      Object.assign(state, getDefaultState())
    },
  },
  actions: {
    login: ({ commit, dispatch }, { token, saved_in, expires_in }) => {
      console.log(saved_in, expires_in)
      commit('SET_TOKEN', { token, saved_in, expires_in })
      dispatch('setTokenExpiring')

      axios.defaults.headers.common['Authorization'] = token
    },
    logout: async ({ commit, getters }) => {
      console.log('sign out')
      commit('RESET')
      axios.defaults.headers.common['Authorization'] = ''
      window.google.accounts.oauth2.revoke(getters.isLoggedIn)
      window.gapi.client.setToken('')
    },
    setTokenExpiring: ({ commit, getters }) => {
      if (!getters.isLoggedIn) return
      const saved_in = getters.getList('saved_in')
      const expires_in = getters.getList('expires_in')
      commit('SET_SUP_DATA', {
        f: 'expiringTimeout',
        data: setValueAfterDelay(
          //
          (data) => commit('SET_SUP_DATA', { f: 'isExpired', data }),
          [false, true],
          expires_in,
          saved_in
        ),
      })
    },
    getDataList: async ({ commit }, payload) => {
      try {
        console.log('dispatch')
        const res = await api.getData(payload)
        console.log(res)
        if (payload.col === 'data') commit('SET_ALL_DATA', { data: res.data })
        else commit('SET_SUP_DATA', { f: payload.col, data: res.data })
      } catch (err) {
        console.log(err)
      }
    },
    async deleteDataList({ commit }, payload) {
      try {
        const res = await api.deleteData(payload)
        if (payload.col === 'data') commit('SET_ALL_DATA', { data: res.data })
        else commit('SET_SUP_DATA', { f: payload.col, data: res.data })
      } catch (e) {
        throw e
      }
    },
    async saveDataChanges({ commit }, payload) {
      try {
        const res = await api.putData(payload)
        // if (payload.col === 'data') commit('SET_ALL_DATA', { data: res.data })
        // else commit('SET_SUP_DATA', { f: payload.col, data: res.data })
        return res
      } catch (e) {
        throw e
      }
    },
  },
})
