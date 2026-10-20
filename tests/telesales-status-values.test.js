import assert from 'node:assert/strict'
import { parseStatusValue, serializeStatusValues } from '../src/app/pages/Telesales/components/PickerSettings/statusValues.js'

const value = 'Không gọi được,Khách bận,Gọi thành công,Khiếu nại'
assert.equal(serializeStatusValues(parseStatusValue(value)), value)
assert.equal(serializeStatusValues([...parseStatusValue(value), { Title: ' Hẹn gọi lại ' }]), `${value},Hẹn gọi lại`)
assert.deepEqual(parseStatusValue(''), [])
assert.equal(serializeStatusValues([]), '')
assert.throws(() => serializeStatusValues([{ Title: ' ' }]))
assert.throws(() => serializeStatusValues([{ Title: 'Khách,bận' }]))
assert.throws(() => serializeStatusValues([{ Title: 'Khách bận' }, { Title: ' khách BẬN ' }]))
console.log('Telesales status parsing, saving and validation checks passed.')
