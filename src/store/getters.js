export const token = (state) => {
  return state.token
}

export const self = (state) => {
  return state.self
}

export const fullscreen = (state) => {
  return state.fullscreen
}

export const isAuthenticated = (state) => {
  return !!state.token
}

export const showMenu = (state) => {
  return !!state.showMenu
}
