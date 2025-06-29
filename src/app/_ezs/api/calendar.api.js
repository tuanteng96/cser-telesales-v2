import http from '../utils/http'

const CalendarAPI = {
  booking: (data) => http.post(`/api/v3/mbookadmin?cmd=AdminBooking`, JSON.stringify(data)),
  getBookId: (id) => http.get(`/api/v3/mbookadmin?cmd=getbooks&id=${id}`)
}

export default CalendarAPI
