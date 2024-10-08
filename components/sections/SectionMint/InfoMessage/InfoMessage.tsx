import { BaseError } from 'viem'

// Components
import LoaderDots from '@/components/common/LoaderDots/LoaderDots'

// Types
import { IMintedMetadata, INFTDataWithId } from '@/types/getNftsAPI'

interface IProps {
    isPrepareFetching: boolean
    prepareError: Error | null
    isWriteLoading: boolean
    isReceiptLoading: boolean
    isClaimedMetadataFetching: boolean
    transactionError: Error | null
    claimedMetadataError: unknown
    mintedMetadata: IMintedMetadata | null | undefined
    mintedQuantity: string | undefined
    isEnoughBalanceToMint: boolean
}

const InfoMessage = ({
    isPrepareFetching,
    prepareError,
    isWriteLoading,
    isReceiptLoading,
    isClaimedMetadataFetching,
    transactionError,
    claimedMetadataError,

    mintedMetadata,
    mintedQuantity,
    isEnoughBalanceToMint,
}: IProps) => {
    const { shortMessage: shortPrepareErrorMessage } =
        (prepareError as BaseError) || {}
    const { shortMessage: shortTransactionErrorMessage } =
        (transactionError as BaseError) || {}

    if (isPrepareFetching)
        return (
            <>
                Please wait. Executing your transaction
                <LoaderDots />
            </>
        )

    if (!isEnoughBalanceToMint) {
        return <>Error: Not enough balance.</>
    }

    if (prepareError) {
        return <>Error: {shortPrepareErrorMessage}. Try again?</>
    }

    if (claimedMetadataError) {
        return (
            <>
                No need to worry. While you&apos;ve successfully claimed the
                NFT, there seems to be an error in fetching the metadata.{' '}
            </>
        )
    }

    if (
        transactionError &&
        shortTransactionErrorMessage === 'User rejected the request.'
    ) {
        return <>You&apos;ve canceled the transaction. Try again?</>
    }

    if (transactionError) {
        return <>Error: {shortTransactionErrorMessage}. Try again?</>
    }

    if (isWriteLoading)
        return (
            <>
                <span className="mr-1 font-bold">Action nedded:</span> Confirm
                transaction in your wallet to continue.
            </>
        )

    if (isReceiptLoading)
        return (
            <>
                Waiting for the receipt
                <LoaderDots />
            </>
        )

    if (isClaimedMetadataFetching)
        return (
            <>
                Transaction sucessfull, getting claimed NFT info
                <LoaderDots />
            </>
        )

    if (mintedMetadata)
        return (
            <>
                NFT{mintedQuantity && +mintedQuantity > 1 ? "'s" : ''}{' '}
                successfully claimed.
            </>
        )

    return (
        <>
        <span className="mr-1 font-bold">
            Wallet connected!
        </span>
        </>
    )
}

export default InfoMessage
