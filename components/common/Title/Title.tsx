import { ReactNode } from 'react'

interface IProps {
    title: string
    children: ReactNode
}

const Title = ({ title, children }: IProps) => {
    return (
        <div className="mx-auto mb-4 flex max-w-auto flex-col">
            <h2 className="mb-2 text-2xl font-bold">{title}</h2>
            <p className="">{children}</p>
        </div>
    )
}

export default Title
