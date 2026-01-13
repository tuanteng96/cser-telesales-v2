import http from '../utils/http'

const TelesalesAPI = {
  addMember: (data) => http.post(`/api/v3/pagetele24@save`, JSON.stringify(data)),
  list: (data) => http.post(`/api/v3/pagetele24@get`, JSON.stringify(data)),
  getMemberID: (MemberID) => http.get(`api/v3/tele23@member_id?memberid=${MemberID}`),
  getListProductInDate: (data) => http.post('/api/v3/tele23@prods_indate', JSON.stringify(data)),
  getListBuydingProduct: ({ MemberID, pi, ps, ProdOrService }) =>
    http.get(`/api/v3/member23?cmd=da_mua&memberid=${MemberID}&pi=${pi}&ps=${ps}&ProdOrService=${ProdOrService}`),
  getHisUseServices: MemberID => {
    return http.get(
      `/services/preview.aspx?a=1&cmd=loadOrderService&MemberID=${MemberID}&IsMember=0&fromOrderAdd=0`
    )
  },
}

export default TelesalesAPI
