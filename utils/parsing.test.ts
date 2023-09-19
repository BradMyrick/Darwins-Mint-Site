import { expect, test } from 'vitest'
import { shortenHexString, getIdFromHash } from './parsing'

// shortenHexString
test('shorten a hexadecimal string', () => {
    expect(shortenHexString('0x54C28209aA8793bB7b493D91b24Ca48eEf262788')).toBe(
        '0x54...2788'
    )
})

test('return undefined if the input string is falsy', () => {
    expect(shortenHexString('')).toBe(undefined)
})

// getIdFromHash
test('convert hash to id number string', () => {
    expect(
        getIdFromHash(
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        )
    ).toBe('1')
})

test('return string if hashId is not in hex', () => {
    expect(getIdFromHash('1')).toBe('1')
})
