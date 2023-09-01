import Image from 'next/image'
import React from 'react'
import AngledContentStripe from '../../shared/AngledContentStripe/AngledContentStripe'
import arrowExternalIcon from '@/assets/arrow-external.svg'
import Title from '@/components/common/Title/Title'


const SectionHero = () => {
    return (
        <div className="z-1 relative m-auto">
            <div className="flex h-[calc(100vh-13rem)] min-h-[30rem] justify-center bg-mayaBlue bg-[url('/cave-pattern.png')] bg-[size:35%] bg-repeat"></div>
            <AngledContentStripe color="yellow">
                <div className="mx-auto flex max-w-[820px] flex-col px-5 py-4 xs:flex-row">
                    <figure className="mx-auto h-[11rem] w-6 min-w-[130px] shrink-0 grow xs:ml-[unset] xs:mr-4 xs:h-full">
                        <Image
                            className="absolute -top-[5.5rem] h-[260px] w-full max-w-[130px]"
                            alt="caveman illustration"
                            width="130"
                            height="260"
                            src="/hero-caveman.png"
                        />
                    </figure>
                    <Title title="Info">
                    <p className="text-md max-w-auto basis shrink grow">
                        <span className="text-lg">
                            <span className="font-bold">
                                The Darwins<sup>NFT</sup>
                            </span>{' '}
                            collection art created by Leyend Lion. All code provided by{' '}
                            <a
                                target="_blank"
                                href="https://x.com/kodr_eth"
                                className="underline-offset-2 hover:underline"
                            >
                                &quot;Kodr&quot; (The Dev)
                                <sup className="ml-[0.1rem]">
                                    <Image
                                        className="inline-block w-[0.8rem] p-[0.05rem] text-dodgerBlue"
                                        src={arrowExternalIcon}
                                        alt="icon of arrow in box"
                                    />
                                </sup>
                            </a>
                            .
                        </span>
                    </p>
                    </Title>
                </div>
            </AngledContentStripe>
        </div>
    )
}

export default SectionHero
