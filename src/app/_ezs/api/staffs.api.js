import http from '../utils/http'

const StaffsAPI = {
  list: (key = '') => http.get(`/api/gl/select2?cmd=user&q=${key}`)
}

export default StaffsAPI
