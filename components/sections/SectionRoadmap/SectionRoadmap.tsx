import Image from 'next/image'
import clsx from 'clsx'

// Data
import { roadmapPhasesConfig } from './data'

// Assets
import arrowExternalIcon from '@/assets/arrow-external.svg'

// Components
import Title from '@/components/common/Title'

const SectionRoadmap = () => {
    return (
        <section className="bg-antiFlashWhite pb-10 pt-[7rem] md:pt-[10rem] justify-center">
            <div className="mx-auto mb-4 flex max-w-[640px] flex-col">
            <Title title="Roadmap">
                Explore the milestones and outline for our gamified ecosystem.
            </Title>
                {roadmapPhasesConfig.map((item, idx) => {
                    const isIndexOdd = idx % 2 !== 0

                    return (
                        <div
                            key={item.name}
                            className="mb-12 flex w-full justify-between bg-linen p-10"
                        >
                            <div
                                className={clsx(
                                    'flex basis-1/2 justify-center',
                                    isIndexOdd && 'order-last'
                                )}
                            >
                                <Image
                                    className="h-[10rem] w-auto max-w-[80%] object-contain"
                                    height={145}
                                    width={145}
                                    alt={item.alt}
                                    src={item.src}
                                />
                            </div>
                            <div
                                className={clsx(
                                    'flex basis-1/2 flex-col justify-center',
                                    isIndexOdd && 'items-center'
                                )}
                            >
                                <h3 className="mb-2 text-2xl font-bold">
                                    {item.name}
                                </h3>
                                <p className="">{item.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default SectionRoadmap
