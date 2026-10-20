export const parseProgressValue = (value = '') => {
  const groups = JSON.parse(value || '[]')
  if (!Array.isArray(groups) || groups.some((group) =>
    !group || typeof group.Title !== 'string' || !Array.isArray(group.Children) ||
    group.Children.some((child) => !child || typeof child.Title !== 'string')
  )) {
    throw new Error('Dữ liệu tiến trình không hợp lệ.')
  }
  return groups
}

export const prepareProgressValues = (groups) => groups.map((group) => {
  const Title = group.Title.trim()
  const Children = group.Children.map((child) => ({ ...child, Title: child.Title.trim() }))
  if (!Title || Children.some((child) => !child.Title)) {
    throw new Error('Vui lòng nhập tên nhóm và tên tiến trình.')
  }
  return { ...group, Title, Children }
})
