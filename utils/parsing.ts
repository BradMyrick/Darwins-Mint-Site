import { fromHex, isHex } from 'viem'

/**
 * Shortens a hexadecimal string by replacing the middle part with ellipsis.
 *
 * @param {string | undefined} hexString - The input hexadecimal string to be shortened.
 * @returns {string | undefined} A shortened version of the input string with ellipsis in the middle,
 * or undefined if the input string is falsy.
 */
const shortenHexString = (hexString: string | undefined) => {
    if (!hexString) return undefined

    const prefixLength = 4
    const suffixLength = 4

    const firstPart = hexString.slice(0, prefixLength)
    const lastPart = hexString.slice(-suffixLength)

    return `${firstPart}...${lastPart}`
}

/**
 * Retrieves an ID from a given hash value.
 *
 * @param {string | undefined} hashId - The hash value to extract the ID from.
 * @returns {string | undefined} The extracted ID, or the original hash value if it's not in the expected format.
 */
const getIdFromHash = (hashId: undefined | string): string | undefined => {
    return isHex(hashId)
        ? fromHex(hashId as '0x${string}', 'number').toString()
        : hashId
}

export { shortenHexString, getIdFromHash }
