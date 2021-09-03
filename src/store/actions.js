import API from '../api/api-class'
const protocol = 'http:'
// Smart api calls
const siteAPI = new API({ url: `${protocol}//ketabland.pythonanywhere.com` })
// const siteAPI = new API({ url: `${protocol}//127.0.0.1:8000` })

export const handleRequestResponse = async (
  { commit },
  { mutation, request }
) => {
  commit(mutation, await request)
}

export const handleRequest = async ({ dispatch, commit }, params = {}) => {
  let { name, action, mutation, data, tokenScope } = params
  const match = name.match(/\bauth/g)
  if (match === null) {
    name = `${name}`
  }
  if (!data) {
    data = {}
  }
  if (!mutation) {
    mutation = null
  }
  if (!tokenScope) {
    tokenScope = ''
  }
  commit('SET_TOKEN_SCOPE', tokenScope)
  siteAPI.createEntity({ name })
  const request = siteAPI.endpoints[name][action](data)
  if (mutation !== null) {
    await dispatch('handleRequestResponse', { mutation, request })
  } else {
    return request
  }
}
// End smart api calls
export const setToken = async ({ commit }, token) => {
  commit('SET_TOKEN', token)
}

export const setSelf = async ({ commit }, self) => {
  commit('SET_SELF', self)
}

export const setFullscreen = async ({ commit }, fullscreen) => {
  commit('SET_FULLSCREEN', fullscreen)
}

export const setLastRequestedPath = ({ commit }, lastRequestedPath) => {
  commit('SET_LAST_REQUESTED_PATH', lastRequestedPath)
}

export const setShowMenu = ({ commit }, showMenu) => {
  commit('SET_SHOW_MENU', showMenu)
}
