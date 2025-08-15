import { fmtMXN, toDMY } from './lib/format'

test('fmtMXN formats currency', () => {
  expect(fmtMXN(1234.5)).toContain('$')
})
test('toDMY converts ISO', () => {
  expect(toDMY('2025-08-01')).toBe('01/08/2025')
})
