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
    files: [],
    alldata: [],
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
      state.expires_in = expires_in
      // state.expires_in = 75

      // console.log(state.token)
      // console.log(state.saved_in)
      // console.log(state.expires_in)
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_SUP_DATA: (state, { f, data }) => {
      // console.log('in SET:', f, data)
      state[f] = data
    },
    SET_LOAD_STATE: (state, value) => {
      state.loadState = value
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState())
    },
  },
  actions: {
    login: ({ commit, dispatch }, { token, saved_in, expires_in }) => {
      console.log(saved_in, expires_in)
      commit('SET_TOKEN', { token, saved_in, expires_in })
      dispatch('setTokenExpiring')

      axios.defaults.headers.common['Authorization'] = token
      // commit('SET_USER', user)
    },
    logout: async ({ commit, getters }) => {
      console.log('sign out')
      await window.google.accounts.oauth2.revoke(getters.isLoggedIn)
      window.gapi.client.setToken('')
      commit('RESET', '')
      axios.defaults.headers.common['Authorization'] = ''
    },
    setTokenExpiring: ({ commit, getters }) => {
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
    getDataList: async ({ commit }, params) => {
      try {
        console.log('dispatch')
        const res = await api.getData(params)
        console.log(res)
        commit('SET_SUP_DATA', { f: params.col, data: res.data })
      } catch (err) {
        console.log(err)
      }
    },
  },
  modules: {},
})
