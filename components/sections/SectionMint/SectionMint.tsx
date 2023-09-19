import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi'
import { etherUnits, fromHex, parseEther, parseUnits } from 'viem'
import clsx from 'clsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Contract
import { contractConfig } from '@/contract/config'

// Requests
import { getNFTMetadata } from '@/requests'

// Contexts
import { useContractContext } from '@/context/ContractContext'
import { useUserContext } from '@/context/UserContext'

// Hooks
import useIsWrongNetwork from '@/hooks/useIsWrongNetwork'

// Components
import AngledContentStripe from '@/components/shared/AngledContentStripe/AngledContentStripe'
import Modal from '@/components/common/Modal/Modal'
import Button from '@/components/common/Button/Button'
import InputNft from '@/components/sections/SectionMint/InputNft'
import Faucet from '@/components/sections/SectionMint/Faucet/Faucet'
import NFTGalleryModal from '@/components/NFTGallery/Modal'
import InfoMessage from './InfoMessage'
import WrongNetworkNotice from './WrongNetworkNotice'
import NotConnectedNotice from './NotConnectedNotice'
import InfoMessageWrapper from './InfoMessageWrapper'
import ClaimedNFT from './ClaimedNFT'

// Types
import { GetNfts, IMintedMetadata } from '@/types/getNftsAPI'

const pricePerNFT = +process.env.NEXT_PUBLIC_NFT_PRICE! as unknown as number

const SectionMint = () => {
    const { address, isConnected } = useAccount()
    const queryClient = useQueryClient()
    const { isWrongNetwork } = useIsWrongNetwork()

    const {
        isPublicMintLive,
        totalMinted,
        isTotalMintedFetching,
        refetchTotalMinted,
    } = useContractContext()
    const {
        userBalance,
        isUserBalanceFetching,
        userDarwinPublicMints,
        refetchUserTotalNftBalance,
        refetchUserBalance,
    } = useUserContext()

    const [showClaimedNFTModal, setShowClaimedNFTModal] = useState(false)
    const [showNFTGalleryModal, setShowNFTGalleryModal] = useState(false)
    const [inputValue, setInputValue] = useState('1')
    const [quantity, setQuantity] = useState(inputValue)
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
    const [mintedNFTId, setMintedNFTId] = useState<number | undefined>(
        undefined
    )
    const [mintedMetadata, setMintedMetadata] = useState<
        IMintedMetadata | null | undefined
    >(null)

    const lowUserBalance =
        typeof userBalance?.formatted === 'string' &&
        +userBalance.formatted < 0.0069

    const totalPrice = quantity ? pricePerNFT * +quantity : undefined
    const isEnoughBalanceToMint =
        typeof userBalance?.formatted === 'string' && totalPrice
            ? +userBalance.formatted >= totalPrice
            : true


    const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isFetching: isPrepareFetching,
        isLoading: isPrepareLoading,
        isFetchedAfterMount: isPrepareFetchedAfterMount,
        refetch: refetchPrepare,
    } = usePrepareContractWrite({
        ...contractConfig,
        functionName: 'publicMint',
        args: [parseUnits(quantity, 0)],
        value: parseEther(totalPrice?.toString() || '0'),
        enabled: false,
    })
    const {
        isLoading: isTransactionLoading,
        write,
        isError: isTransactionError,
        data: transactionData,
        error: transactionError,
        reset,
    } = useContractWrite({
        ...config,
        onSuccess(data) {
            setHash(data?.hash)
        },
    })

    const {
        data: receiptData,
        isError: isReceiptError,
        isLoading: isReceiptLoading,
    } = useWaitForTransaction({
        hash,
        onSettled(data) {
            setHash(undefined)

            const logsWithId = data?.logs?.find((item) => item.data === '0x')

            setMintedNFTId(
                logsWithId?.topics?.[3]
                    ? fromHex(logsWithId?.topics?.[3]!, 'number')
                    : undefined
            )
        },
    })

    const {
        status: claimedMetadataStatus,
        isFetching: isClaimedMetadataFetching,
        isError: isClaimedMetadataError,
        data: claimedMetadata,
        refetch: fetchClaimedMetadata,
        error: claimedMetadataError,
        isSuccess: isClaimedMetadataSuccess,
        remove,
    } = useQuery({
        enabled: false,
        queryKey: ['nftURILink', mintedNFTId],
        queryFn: () => getNFTMetadata(mintedNFTId),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    })

    const mintNFT = async () => {
        remove()
        reset()
        setMintedMetadata(null)
        const prepareResponse = await refetchPrepare()

        if (prepareResponse.isSuccess) {
            setTimeout(() => {
                write?.()
            }, 0)
        }
    }

    const claimedNFTModalData = useMemo(
        () => ({
            metadata: mintedMetadata,
            id: { tokenId: mintedMetadata?.id },
        }),
        [mintedMetadata]
    )

    useEffect(() => {
        setQuantity(inputValue)
    }, [inputValue])

    // fetch metadata for minted NFT
    useEffect(() => {
        if (mintedNFTId) {
            fetchClaimedMetadata()
        }
    }, [mintedNFTId, fetchClaimedMetadata])

    useEffect(() => {
        if (
            claimedMetadataStatus === 'success' ||
            claimedMetadataStatus === 'error'
        ) {
            setMintedNFTId(undefined)
            refetchTotalMinted()
            refetchUserTotalNftBalance()
            refetchUserBalance()
            setInputValue('1')
            setMintedMetadata({
                ...claimedMetadata?.data?.metadata,
                id: claimedMetadata?.data?.id?.tokenId,
                quantity,
            })

            if (+quantity > 1) {
                queryClient.invalidateQueries({
                    queryKey: ['userNfts', address],
                    refetchType: 'none',
                })
            } else if (+quantity === 1) {
                queryClient.setQueryData(
                    ['userNfts', address],
                    (oldData: null | undefined | GetNfts) => {
                        if (oldData?.data) {
                            return {
                                ...oldData,
                                data: {
                                    ...oldData.data,
                                    ownedNfts: [
                                        ...oldData.data.ownedNfts,
                                        { ...claimedMetadata?.data },
                                    ],
                                },
                            }
                        }
                    }
                )
            }
        }
    }, [
        claimedMetadataStatus,
        claimedMetadata,
        quantity,
        queryClient,
        address,
        refetchTotalMinted,
        refetchUserTotalNftBalance,
        refetchUserBalance,
    ])

    useEffect(() => {
        setInputValue('1')
        setMintedNFTId(undefined)
        setMintedMetadata(null)
    }, [address])

    return (
        <section className="pt-[7rem] lg:pt-[10rem] justify-center bg-antiFlashWhite">

            {/* Notices */}
            {!isConnected ? <NotConnectedNotice /> : null}
            {isConnected && lowUserBalance && !isWrongNetwork ? (
                <Faucet />
            ) : null}
            {isWrongNetwork ? <WrongNetworkNotice /> : null}

            {/* Minting */}

            <div
                className={clsx(
                    'mx-auto max-w-[640px]',
                    (isConnected === false ||
                        lowUserBalance ||
                        isWrongNetwork) &&
                    'opacity-30'
                )}
            >
                {isConnected && !lowUserBalance && !isWrongNetwork ? (
                    <InfoMessageWrapper
                        isLoading={
                            isPrepareFetching ||
                            isReceiptLoading
                        }
                        isMetadataLoading={isClaimedMetadataFetching}
                        isError={
                            isPrepareError ||
                            isTransactionError ||
                            isClaimedMetadataError ||
                            !isEnoughBalanceToMint
                        }
                        isActionRequired={isTransactionLoading}
                        isSuccess={
                            !!mintedMetadata
                        }
                    >
                        <InfoMessage
                            isPrepareFetching={isPrepareFetching}
                            prepareError={prepareError}
                            claimedMetadataError={claimedMetadataError}
                            isWriteLoading={isTransactionLoading}
                            isReceiptLoading={isReceiptLoading}
                            isClaimedMetadataFetching={isClaimedMetadataFetching}
                            transactionError={transactionError}
                            mintedMetadata={mintedMetadata}
                            mintedQuantity={claimedNFTModalData?.metadata?.quantity}
                            isEnoughBalanceToMint={isEnoughBalanceToMint} />
                    </InfoMessageWrapper>
                ) : null}
                <div
                    className="mb-[10rem] flex flex-col bg-linen md:flex-row"
                    data-cy="container-minting"
                >
                    <div className="flex-column order-last flex basis-2/3 flex-col items-center justify-center p-10 text-center md:order-first">
                        <InputNft
                            value={inputValue}
                            setValue={setInputValue}
                            isDisabled={
                                !inputValue ||
                                isWrongNetwork ||
                                lowUserBalance ||
                                isClaimedMetadataFetching ||
                                isUserBalanceFetching ||
                                isPrepareFetching ||
                                isTransactionLoading ||
                                !isPublicMintLive ||
                                isReceiptLoading ||
                                !isEnoughBalanceToMint
                            }
                        />
                        <p className="mb-9 text-sm">
                            {isWrongNetwork
                                ? 'Please switch to the correct network to mint NFTs.'
                                : lowUserBalance
                                    ? 'You need to have at least 0.0069 ETH to mint NFTs.'
                                    : !isEnoughBalanceToMint
                                        ? 'Not enough balance to mint NFTs.'
                                        : isPublicMintLive
                                            ? 'Minting is live. Mint away!'
                                            : 'Minting is not live yet. Stay tuned!'}
                        </p>
                        <Button
                            type="button"
                            variation="primary"
                            onClick={mintNFT}
                            disabled={
                                !inputValue ||
                                isWrongNetwork ||
                                lowUserBalance ||
                                !isPublicMintLive ||
                                isClaimedMetadataFetching ||
                                isUserBalanceFetching ||
                                isPrepareFetching ||
                                isTransactionLoading ||
                                isReceiptLoading ||
                                !isEnoughBalanceToMint
                            }
                            data-cy="btn-mint"
                        >
                            MINT
                        </Button>
                    </div>

                    {/* darwin avatar image */}
                    <div className="relative grow pt-10 text-center md:p-10 ">
                        <div className="triangle absolute left-1/2 top-0 -translate-x-1/2 transform border-t-linen"></div>
                        <button
                            type="button"
                            className={clsx(
                                'relative h-[10rem] md:h-[13.5rem]',
                                !mintedMetadata && 'cursor-default'
                            )}
                            disabled={!mintedMetadata}
                            onClick={() => setShowClaimedNFTModal(true)}
                            data-cy="btn-claimed-nft"
                            data-nft-id={mintedMetadata?.id}
                        >
                            <Image
                                className="relative z-[1] h-full w-full"
                                width="100"
                                height="50"
                                src={'/DARWINS.png'}
                                alt={
                                    'placeholder NFT caveman'
                                }
                            />
                        </button>
                    </div>
                </div>
            </div>
            <AngledContentStripe color="blue">
                <div className="mx-auto flex max-w-[820px] flex-col px-5 py-4 xs:flex-row">
                    <p className="text-md max-w-auto basis shrink grow pt-2">
                        NFTs within &apos;The Darwins&apos; are a fusion of history and innovation. Each NFT possesses unique evolutionary mechanics, transcending mere digital collectibles. They embody blockchain&apos;s unalterable essence and the unfolding journey within.
                        <br />
                        <br />
                        <span className="text-lg">
                            The{' '}
                            <span className="font-bold">
                                The Darwins
                                <sup>NFT</sup>
                            </span>{' '}
                            welcomes you to evolve with us.
                        </span>
                    </p>
                    <figure className="sx:mr-[unset] mx-auto mt-4 h-auto w-6 min-w-[120px] shrink-0 grow xs:ml-4 xs:h-full md:mt-0">

                    </figure>
                </div>
            </AngledContentStripe>

            {/* Modals */}
            {showClaimedNFTModal ? (
                <Modal setIsOpen={setShowClaimedNFTModal}>
                    <ClaimedNFT
                        quantity={mintedMetadata?.quantity}
                        setShowModal={setShowClaimedNFTModal}
                        setShowNFTGalleryModal={setShowNFTGalleryModal}
                        data={claimedNFTModalData}
                    />
                </Modal>
            ) : null}
            <NFTGalleryModal
                isOpen={showNFTGalleryModal}
                setIsOpen={setShowNFTGalleryModal}
            />
        </section>
    )
}

export default SectionMint