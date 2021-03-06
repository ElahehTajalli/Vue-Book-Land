import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(Vuex)

const getDefaultState = () => {
  return {
    token: window.localStorage.getItem('token') || '',
    self: null,
    fullscreen: false,
    lastRequestedPath: '',
    showMenu: false,
    posts: [],
    books: [],
    quotes: []
  }
}
const state = getDefaultState()

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_SELF(state, self) {
    state.self = self
  },
  SET_FULLSCREEN(state, fullscreen) {
    state.fullscreen = fullscreen
  },
  SET_TOKEN_SCOPE(state, tokenScope) {
    state.tokenScope = tokenScope
  },
  SET_LAST_REQUESTED_PATH(state, lastRequestedPath) {
    state.lastRequestedPath = lastRequestedPath
  },
  SET_SHOW_MENU(state, showMenu) {
    state.showMenu = showMenu
  },
  SET_BOOKS(state, books) {
    state.books = books
  },
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  SET_QUOTES(state, quotes) {
    state.quotes = quotes
  }
}

export const store = new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
