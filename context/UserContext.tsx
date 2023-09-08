import { createContext, ReactNode, useContext } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBalance, useContractRead } from 'wagmi'

// Contexts
import { useContractContext } from './ContractContext'

// Contract
import { contractConfig } from '@/contract/config'

interface IProps {
    userTotalNftBalance: undefined | number
    isUserTotalNftBalanceFetching: boolean
    refetchUserTotalNftBalance: () => void
    userDarwinPublicMints: undefined | number
    isUserDarwinPublicMintsFetching: boolean
    refetchUserDarwinPublicMints: () => void
    userBalance:
        | undefined
        | {
              decimals: number
              formatted: string
              symbol: string
              value: bigint
          }
    isUserBalanceFetching: boolean
    refetchUserBalance: () => void
}

const UserContext = createContext<IProps>({
    userTotalNftBalance: undefined,
    isUserTotalNftBalanceFetching: true,
    refetchUserTotalNftBalance: () => null,
    userDarwinPublicMints: undefined,
    isUserDarwinPublicMintsFetching: true,
    refetchUserDarwinPublicMints: () => null,
    userBalance: undefined,
    isUserBalanceFetching: true,
    refetchUserBalance: () => null,
})

export function UserProvider({ children }: { children: ReactNode }) {
    const { address } = useAccount()

    const {
        data: userTotalNftBalanceBigInt,
        isFetching: isUserTotalNftBalanceFetching,
        refetch: refetchUserTotalNftBalance,
        isFetchedAfterMount: isUserTotalNftBalanceChecked,
    } = useContractRead({
        ...contractConfig,
        enabled: !!address,
        functionName: 'balanceOf',
        args: [address!],
    })

    const {
        data: userDarwinPublicMints,
        isFetching: isUserDarwinPublicMintsFetching,
        refetch: refetchUserDarwinPublicMints,
        isFetchedAfterMount: isUserDarwinPublicMintsChecked,
    } = useContractRead({
        ...contractConfig,
        enabled: !!address,
        functionName: 'getPublicMintedAmount',
        //@ts-ignore
        args: [address!],
    })

    const {
        data: userBalance,
        refetch: refetchUserBalance,
        isError,
        isLoading,
        isFetching: isUserBalanceFetching,
        isFetchedAfterMount: isUserBalanceChecked,
    } = useBalance({
        address,
    })

    const userTotalNftBalance =
        typeof userTotalNftBalanceBigInt === 'bigint'
            ? +formatUnits(userTotalNftBalanceBigInt, 0)
            : undefined

    const userPhaseNftBalance =
        typeof userDarwinPublicMints === 'bigint'
            ? +formatUnits(userDarwinPublicMints, 0)
            : undefined

    return (
        <UserContext.Provider
            value={{
                userTotalNftBalance: isUserTotalNftBalanceChecked
                    ? userTotalNftBalance
                    : undefined,
                isUserTotalNftBalanceFetching,
                refetchUserTotalNftBalance,
                userDarwinPublicMints: isUserDarwinPublicMintsChecked
                    ? userPhaseNftBalance
                    : undefined,
                isUserDarwinPublicMintsFetching,
                refetchUserDarwinPublicMints,
                userBalance: isUserBalanceChecked ? userBalance : undefined,
                isUserBalanceFetching,
                refetchUserBalance,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    const context = useContext(UserContext)

    // error handling (if component is not inside context provider)
    if (context === undefined) {
        throw new Error('useUserContext must be used inside a UserProvider')
    }

    return context
}
