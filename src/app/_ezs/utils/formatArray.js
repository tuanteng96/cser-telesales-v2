import moment from "moment"

export const formatArray = {
  useInfiniteQuery: (page, key = 'data') => {
    let newPages = []
    if (!page || !page[0]) return newPages
    for (let items of page) {
      for (let x of items[key]) {
        newPages.push(x)
      }
    }
    return newPages
  },
  findNodeByName: (data, name) => {
    let response = null
    let findNameItem = (tree) => {
      let result = null
      if (tree.name === name) {
        return tree
      }

      if (Array.isArray(tree.children) && tree.children.length > 0) {
        tree.children.some((node) => {
          result = findNameItem(node)
          return result
        })
      }
      return result
    }
    if (!data) return null
    for (let item of data) {
      if (findNameItem(item)) {
        response = findNameItem(item)
        break
      }
    }
    return response
  },
  arrayMove: (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      var k = newIndex - array.length + 1
      while (k--) {
        array.push(undefined)
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
    return array
  },
  groupByDate: (arr, name = 'BookDate') => {
    if (!Array.isArray(arr) || !arr.length) return []

    const m = new Map()
    
    for (const it of arr) {
      const dayFull = it?.[name]
      
      if (!dayFull) continue
      const day = dayFull.slice(0, 10) // YYYY-MM-DD

      let g = m.get(day)
      if (!g) m.set(day, (g = { day, dayFull, items: [] }))
      else if (dayFull > g.dayFull) g.dayFull = dayFull // lấy dayFull mới nhất trong ngày

      g.items.push(it)
    }

    const groups = Array.from(m.values())

    for (const g of groups) {
      g.items.sort((a, b) => moment.utc(b[name]).diff(moment.utc(a[name])))
    }

    groups.sort((a, b) => moment.utc(b.dayFull).diff(moment.utc(a.dayFull)))
    return groups
  }
}
