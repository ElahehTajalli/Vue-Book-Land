export const requestSuccessInterceptor = (config) => {
  const tokenType = 'Token'
  let token = window.localStorage.getItem('token')

  if (token && token !== null) {
    config.headers.common['Authorization'] = `${tokenType} ${token}`
  }
  config.headers.common['Accept-Language'] = 'fa'
  return config
}

export const requestErrorInterceptor = (error) => {
  return Promise.reject(error)
}
