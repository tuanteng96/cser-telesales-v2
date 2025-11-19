import http from '../utils/http'

const ProdsAPI = {
  getRootServices: ({ MemberID = '', StockID = '', Key = '' }) =>
    http.get(`/api/v3/mbook?cmd=getroot&memberid=${MemberID}&ps=1000&pi=1&key=${Key}&stockid=${StockID}${window?.top?.GlobalConfig?.Admin?.dat_lich_hien_dv_an ? "&isrootpublic=-1" : ""}`)
}

export default ProdsAPI
