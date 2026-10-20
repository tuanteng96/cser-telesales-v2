import assert from 'node:assert/strict'
import { parseProgressValue, prepareProgressValues } from '../src/app/pages/Telesales/components/PickerSettings/progressValues.js'

const groups = [
  { Title: 'Trực Page', Children: [{ Title: 'Khách mới nhập' }, { Title: 'Khách báo sai số - đã xin lại' }] },
  { Title: 'Telesales', Children: [{ Title: 'Đang tiếp cận' }, { Title: 'Đặt lịch thành công' }] },
  { Title: 'Tại Spa', Children: [{ Title: 'Khách không đến' }, { Title: 'Khách đến' }] }
]
assert.deepEqual(prepareProgressValues(parseProgressValue(JSON.stringify(groups))), groups)
const edited = parseProgressValue(JSON.stringify(groups))
edited[1].Children.push({ Title: ' Hẹn gọi lại ' })
edited.splice(0, 1)
edited.push({ Title: ' Nhóm mới ', Children: [] })
const saved = prepareProgressValues(edited)
assert.equal(saved[0].Title, 'Telesales')
assert.deepEqual(saved[0].Children.at(-1), { Title: 'Hẹn gọi lại' })
assert.deepEqual(saved.at(-1), { Title: 'Nhóm mới', Children: [] })
assert.deepEqual(parseProgressValue(JSON.stringify(saved)), saved)
assert.deepEqual(parseProgressValue(''), [])
assert.throws(() => parseProgressValue('invalid json'))
assert.throws(() => parseProgressValue('{}'))
assert.throws(() => parseProgressValue('[{"Title":"Group","Children":[{}]}]'))
assert.throws(() => prepareProgressValues([{ Title: ' ', Children: [] }]))
assert.throws(() => prepareProgressValues([{ Title: 'Group', Children: [{ Title: ' ' }] }]))
console.log('Telesales progress parsing, nested edits and save payload checks passed.')
