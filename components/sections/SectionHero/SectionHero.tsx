import Image from 'next/image'
import React from 'react'
import AngledContentStripe from '../../shared/AngledContentStripe/AngledContentStripe'
import arrowExternalIcon from '@/assets/arrow-external.svg'
import Title from '@/components/common/Title/Title'


const SectionHero = () => {
    return (
        <div className="z-1 relative m-auto">
            <div className="flex h-[calc(100vh-13rem)] min-h-[30rem] justify-center bg-mayaBlue bg-[url('/darwin-pattern.png')] bg-[size:45%] bg-repeat"></div>
            <AngledContentStripe color="yellow">
                <div className="mx-auto flex max-w-auto flex-col px-0 py-3 lg:flex-row">
                    <figure className="mx-auto h-[4rem] w-6 min-w-[130px] shrink-0 grow xs:ml-[unset] xs:mr-4 xs:h-full">
                    </figure>
                    <Title title="Info">
                        <p className="text-lg">

                            <span className="font-bold text-2xl">
                                The Darwins<sup>NFT</sup>
                            </span>{' '}
                            is a communtiy collaborative project with a dedicated core team:

                            <ul>
                                <br />
                                <li>
                                    Kodr - Dev (Website, Smart-Contract, Game logic)
                                </li>
                                <br />
                                <li>
                                    Fencer - Twitter strategy, Project management, Spaces host, Strategic partnerships, Editor, Trait generation, Recruitment
                                </li>
                                <br />
                                <li>
                                    Ley - Artist (Collection Art, Graphics, Marketing)
                                </li>
                                <br />
                                <li>
                                    Rad - Discord Manager (Vibes, Host, Community engagement, Bot integration)
                                </li>
                                <br />
                            </ul>
                        </p>
                    </Title>
                </div>
            </AngledContentStripe>
        </div>
    )
}


export default SectionHero
