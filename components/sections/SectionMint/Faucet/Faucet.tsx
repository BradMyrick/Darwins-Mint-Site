import Image from 'next/image'

// Assets
import arrowExternalIcon from '@/assets/arrow-external.svg'

// Contexts
import { useUserContext } from '@/context/UserContext'

// Hooks
import useIsWrongNetwork from '@/hooks/useIsWrongNetwork'

// Components
import Button from '@/components/common/Button/Button'
import LoaderDots from '@/components/common/LoaderDots/LoaderDots'

const faucets = process.env.NEXT_PUBLIC_FAUCET?.split(',')

const Faucet = () => {
    const { userBalance, isUserBalanceFetching, refetchUserBalance } =
        useUserContext()

    const { preferredNetwork } = useIsWrongNetwork()
    const nativeCurrency = preferredNetwork?.nativeCurrency?.symbol

    return (
        <div
            className="mx-auto mb-5 flex max-w-[640px] flex-col bg-silver p-5"
            data-cy="notice-faucet"
        >
            <span className="mb-4 block">
                <span className="font-bold">
                    You&apos;re low on {nativeCurrency}!
                </span>
                <br />
                Your current balance is {userBalance?.formatted}{' '}
                {nativeCurrency}. You must have at least 0.0015 {nativeCurrency}{' '}, plus a small amount for gas fees, to mint a Darwin.
            </span>
            <span className="mb-5 block border-b border-dashed border-wenge/40"></span>
            <span className="mb-4 block">
                1. Purchase {nativeCurrency} from an exchange
            </span>

            <div>
                2. After you&apos;ve purchased,{' '}
                <Button
                    className="mr-2"
                    size="sm"
                    disabled={isUserBalanceFetching}
                    type="button"
                    onClick={refetchUserBalance}
                    data-cy="btn-recheck-balance"
                >
                    recheck {isUserBalanceFetching ? <LoaderDots /> : null}
                </Button>{' '}
                your balance.
            </div>
        </div>
    )
}

export default Faucet
