export const toAbsoluteUrl = pathname =>
  import.meta.env.PUBLIC_URL + pathname
export const toAbsolutePath = pathname =>
  import.meta.env.REACT_APP_API_URL + '/upload/image/' + pathname