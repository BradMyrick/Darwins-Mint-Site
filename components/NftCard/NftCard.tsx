import { useEffect, useState } from 'react'
import Image from 'next/image'
import { fromHex, isHex } from 'viem'
import clsx from 'clsx'

// Utilities
import { getIdFromHash } from '@/utils'

// Types
import { INFT, INFTDataWithId } from '@/types/getNftsAPI'

interface IProps {
    data: Partial<INFT> | null | undefined
}

const NftCard = ({ data }: IProps) => {
    const [flip, setFlip] = useState(false)
    const [currentData, setCurrentData] = useState<
        Partial<INFTDataWithId> | null | undefined
    >(null)
    const [isChanging, setIsChanging] = useState(false)

    // parse id
    const id = getIdFromHash(data?.id?.tokenId)

    const cardClass = clsx(
        'relative h-full w-full [transform-style:preserve-3d] [transition:transform_0.7s_ease_0s]',
        flip && 'animate-flip'
    )

    useEffect(() => {
        if (id && typeof id === 'string') {
            setIsChanging(true)
            setFlip((curr) => true)
            const to = setTimeout(() => {
                setFlip((curr) => false)
                setCurrentData({ ...data, id: id })
                setIsChanging(false)
            }, 700)

            return () => {
                if (to) {
                    setCurrentData({ ...data, id: id })
                }
                setFlip((curr) => false)
                setIsChanging(false)
                clearTimeout(to)
            }
        }
    }, [data, id])

    return (
        <>
            <div
                className="h-[24.4rem] w-[16rem] [perspective:1000px]"
                data-cy="nft-card"
                data-nft-id={id}
            >
                <div className={cardClass}>
                    {/* card front */}
                    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-md bg-linen shadow-md [backface-visibility:hidden]">
                        <div className="flex items-center justify-between bg-wenge bg-[url('/darwin-pattern.png')] bg-[size:180px] bg-right-top bg-repeat px-2 py-1.5">
                            <Image
                                width="60"
                                height="40"
                                src="/logo.png"
                                alt="logo"
                            />
                            {currentData?.id ? (
                                <a
                                    href={`https://goerli.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT}?a=${currentData?.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-antiFlashWhite px-1 text-xsP font-semibold"
                                    data-cy="href-nft"
                                >
                                    {currentData?.id}
                                </a>
                            ) : null}
                        </div>

                        <div
                            className={clsx(
                                'flex h-auto flex-grow flex-col bg-[#F8F8F8] p-2.5 pt-1.5 transition-opacity',
                                isChanging && 'opacity-50'
                            )}
                        >
                            <h4
                                className={clsx(
                                    'mb-1.5 truncate text-sm font-semibold',
                                    !currentData && 'bg-gradient-placeholder'
                                )}
                            >
                                {!currentData ? (
                                    <span>&nbsp;</span>
                                ) : (
                                    currentData?.metadata?.name
                                )}
                            </h4>
                            <figure
                                className={clsx(
                                    'relative mb-1.5 w-full pt-[100%]',
                                    !currentData && 'bg-gradient-placeholder'
                                )}
                                style={{
                                    backgroundColor: `#${currentData?.metadata?.background_color}`,
                                }}
                            >
                                {currentData ? (
                                    <Image
                                        className="absolute inset-0 m-auto"
                                        layout="fill"
                                        src={currentData?.metadata?.image || ''
                                        }
                                        alt="caveman prereveal"
                                    />
                                ) : null}
                            </figure>
                            <p
                                className={clsx(
                                    'my-auto max-h-[3.3rem] overflow-hidden text-xsP',
                                    !currentData &&
                                        'h-full bg-gradient-placeholder'
                                )}
                            >
                                {currentData?.metadata?.description}
                            </p>
                        </div>
                    </div>
                    {/* card back */}
                    <div className="absolute inset-0 rounded-md bg-wenge bg-[url('/darwin-pattern.png')] bg-[size:250px] bg-repeat [backface-visibility:hidden] [transform:rotateY(180deg)]" />
                </div>
            </div>
        </>
    )
}

export default NftCard
