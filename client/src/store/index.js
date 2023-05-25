import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import api from '../services/api'

const getDefaultState = () => {
  return {
    token: '',
    user: {},
    loadState: false,
    isMobileSize: false,
    files: [],
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
    getDataList: (state) => (col) => {
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
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_SUP_DATA: (state, { f, data }) => {
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
    login: ({ commit }, { token, user }) => {
      commit('SET_TOKEN', token)
      // commit('SET_USER', user)
    },
    logout: ({ commit }) => {
      commit('RESET', '')
    },
    setFiles: async ({ commit }) => {
      try {
        console.log('dispatch')
        const data = await api.getData({ col: 'files' }).then((res) => res.data)
        console.log(data)
        commit('SET_SUP_DATA', { f: 'files', data })
        // return data
      } catch (err) {
        console.log(err)
      }
    },
  },
  modules: {},
})
