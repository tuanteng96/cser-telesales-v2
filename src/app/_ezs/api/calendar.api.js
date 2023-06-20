import http from '../utils/http'

const CalendarAPI = {
  booking: (data) => http.post(`/api/v3/mbookadmin?cmd=AdminBooking`, JSON.stringify(data))
}

export default CalendarAPI
