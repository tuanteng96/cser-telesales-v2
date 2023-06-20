import http from '../utils/http'

const TelesalesAPI = {
  addMember: (data) => http.post(`/api/v3/pagetele24@save`, JSON.stringify(data)),
  list: (data) => http.post(`/api/v3/pagetele24@get`, JSON.stringify(data))
}

export default TelesalesAPI
