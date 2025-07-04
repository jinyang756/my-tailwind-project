import { createStore } from 'vuex'

export default createStore({
  state: {
    readingProgress: {},
    theme: 'dark',
    fontSize: 16,
    fontFamily: 'serif'
  },
  mutations: {
    setReadingProgress(state, { bookId, progress }) {
      state.readingProgress[bookId] = progress
    },
    setTheme(state, theme) {
      state.theme = theme
    },
    setFontSize(state, size) {
      state.fontSize = size
    },
    setFontFamily(state, family) {
      state.fontFamily = family
    }
  },
  actions: {
    saveReadingProgress({ commit }, payload) {
      commit('setReadingProgress', payload)
      // 可以在这里添加本地存储逻辑
    }
  },
  getters: {
    getReadingProgress: (state) => (bookId) => {
      return state.readingProgress[bookId] || 0
    }
  }
})