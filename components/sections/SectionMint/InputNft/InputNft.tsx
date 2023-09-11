import { Dispatch, SetStateAction } from 'react'

// Contexts
import { useContractContext } from '@/context/ContractContext'

// Components
import Button from '@/components/common/Button'

interface IProps {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    isDisabled: boolean
}

const InputNft = ({
    value,
    setValue,
    isDisabled,
}: IProps) => {
    const { isPublicMintLive } = useContractContext()

    return (
        <div className="mx-auto mb-4 flex max-w-[16rem] border-2 border-x-wenge bg-white p-2">
            <Button
                variation="secondary"
                type="button"
                onClick={() =>
                    setValue((curr: string) => Math.max(1, +curr - 1).toString())
                }
                disabled={!isPublicMintLive}
                data-cy="btn-minus"
            >
                -
            </Button>
            <input
                className="w-[80%] text-center placeholder:text-sm disabled:text-silver"
                type="text"
                inputMode="numeric"
                pattern='[0-9]{1,3}'
                value={value}
                onChange={(e) => {
                    if (!e.target.validity.patternMismatch) {
                        setValue(e.target.value)
                    }
                }}
                disabled={!isPublicMintLive}
                placeholder="quantity"
                data-cy="input-quantity"
            />
            <Button
                variation="secondary"
                type="button"
                onClick={() =>
                    setValue((curr: string) => Math.min(500, +curr + 1).toString())
                }
                disabled={!isPublicMintLive}
                data-cy="btn-plus"
            >
                +
            </Button>
        </div>
    )
}

export default InputNft

