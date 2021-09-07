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

export const posts = (state) => {
  return state.posts
}

export const books = (state) => {
  return state.books
}

export const quotes = (state) => {
  return state.quotes
}
