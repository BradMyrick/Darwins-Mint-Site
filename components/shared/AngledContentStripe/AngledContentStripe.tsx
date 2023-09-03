import { ReactNode } from 'react';
import clsx from 'clsx';

// TS
interface IProps {
    children: ReactNode;
    color?: 'yellow' | 'blue';
}

// Ensure tailwind will include styles
const includeStyles = 'bg-dodgerBlue fill-dodgerBlue fill-cadmiumOrange';

const AngledContentStripe = ({ children, color = 'yellow' }: IProps) => {
    const backgroundClass = clsx(
        color === 'yellow' && 'cadmiumOrange',
        color === 'blue' && 'dodgerBlue'
    );

    return (
        <div
            className={`relative m-auto bg-${backgroundClass} flex max-w-[1024px]`}
        >
            <svg
                preserveAspectRatio="none"
                width="100%"
                height="69"
                viewBox="0 0 1024 68"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth={0}
                className={`absolute left-0 top-[1px] -translate-y-full fill-${backgroundClass}`}
            >
                <path d="M0 0 C100 34,500 34,1024 0 V68.5 H0 Z" />
            </svg>
            <svg
                preserveAspectRatio="none"
                width="100%"
                height="69"
                viewBox="0 0 1024 68"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute bottom-[1px] left-0 translate-y-full fill-${backgroundClass}`}
                strokeWidth={0}
            >
                <path d="M0 68.5 C100 34.5,500 34.5,1024 65 V0 H0 Z" />
            </svg>
            {children}

        </div>
    );
};

export default AngledContentStripe;
