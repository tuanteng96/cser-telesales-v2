export const parseStatusValue = (value = '') =>
  value.split(',').map((title) => title.trim()).filter(Boolean).map((Title) => ({ Title }))

export const serializeStatusValues = (items) => {
  const titles = items.map(({ Title }) => Title.trim())
  if (titles.some((title) => !title || title.includes(','))) {
    throw new Error('Tên trạng thái không được để trống hoặc chứa dấu phẩy.')
  }
  if (new Set(titles.map((title) => title.toLocaleLowerCase('vi'))).size !== titles.length) {
    throw new Error('Tên trạng thái không được trùng nhau.')
  }
  return titles.join(',')
}
