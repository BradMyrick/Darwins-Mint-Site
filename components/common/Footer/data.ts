import { shortenHexString } from '@/utils'




export const contractInfoLabelsData = [
    {
        name: 'address',
        value: shortenHexString(process.env.NEXT_PUBLIC_CONTRACT),
        href: `https://etherscan.io/address/${process.env.NEXT_PUBLIC_CONTRACT}`,
    },
    {
        name: 'standard',
        value: 'ERC721A',
        href: 'https://www.erc721a.org/',
    },
    {
        name: 'network',
        value: 'Ethereum',
    },
    {
        name: 'NFT price*',
        value: `${process.env.NEXT_PUBLIC_NFT_PRICE} ETH`,
    },
    {
        name: 'created by',
        value: 'kodr.eth',
        href: 'https://kodr.pro',
    },
]
