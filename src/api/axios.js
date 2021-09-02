import axios from 'axios'
import Qs from 'qs'
import {
  requestSuccessInterceptor,
  requestErrorInterceptor
} from '../api/request-interceptors'
// Declarations

const _axios = axios.create({
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' })
})

_axios.interceptors.request
  .use(requestSuccessInterceptor, requestErrorInterceptor)

export default _axios
