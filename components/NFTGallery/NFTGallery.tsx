import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

// Utilities
import { getIdFromHash, ipfsToHttps } from '@/utils';

// Requests
import { getNFTs } from '@/requests';

// Components
import NftCard from '@/components/NftCard/NftCard';
import Button from '@/components/common/Button';
import LoaderSquare from '@/components/common/LoaderSquare';

// Types
import { INFT } from '@/types/getNftsAPI';

interface IProps {
    setIsOpen: Dispatch<SetStateAction<boolean>> | (() => void);
}

function NFTGallery({ setIsOpen }: IProps) {
    const { address } = useAccount();
    const [nftData, setNftData] = useState<INFT | null>(null);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['userNfts', address],
        enabled: !!address,
        queryFn: () => getNFTs(address),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (data?.data?.totalCount) {
            setNftData(data?.data?.ownedNfts?.[0] || null);
        }
    }, [data]);

    return (
        <div
            className="flex flex-col md:min-h-[32rem] md:w-[40rem] md:flex-row"
            data-cy="container-nft-gallery"
        >
            <section className="flex flex-col bg-linen p-5 md:w-1/2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Your NFT Collection</h3>
                    <Button
                        type="button"
                        size="sm"
                        variation="transparent"
                        onClick={() => setIsOpen(false)}
                        data-cy="btn-modal-close"
                        aria-label="close modal"
                    >
                        x
                    </Button>
                </div>
                <span className="mb-7 block border-b border-dashed border-wenge/40 pt-3" />
                <p className="mb-6 text-xsP">
                    <span className="mb-1 inline-block">
                        Your Darwins <sup>NFT</sup> collection
                        showcase.
                    </span>

                    {isLoading || isFetching ? (
                        <span>
                            Hodl on while we find your NFTs...
                        </span>
                    ) : data?.data?.ownedNfts?.length ? (
                        <span>
                            To dive deeper into the world of The Darwins collection, simply click on any artwork. You&apos;ll uncover additional details about each NFT, allowing you to embark on an exciting journey of exploration and discovery. Happy evolving!
                        </span>

                    ) : (
                        <span>
                            It seems like you haven&apos;t claimed any NFTs yet, but don&apos;t worry! Head over to the minting section to begin your adventure and claim your very first NFT from The Darwins collection. Start your evolutionary journey now!
                        </span>

                    )}
                </p>

                {isLoading || isFetching ? (
                    <div className="flex h-auto w-full grow items-center justify-center">
                        <LoaderSquare />
                    </div>
                ) : (
                    <div className="grid auto-cols-[minmax(33%,_1fr)] grid-flow-col grid-cols-[repeat(3,minmax(33%,1fr))] gap-4 overflow-auto md:h-[17.5rem] md:grid-flow-row md:grid-cols-2">
                        {data?.data?.ownedNfts?.map((item: INFT) => (
                            <button
                                key={item?.id?.tokenId}
                                type="button"
                                className="relative max-h-0.5 pt-[100%] md:w-full"
                                onClick={() => setNftData(item)}
                                data-cy={`btn-nft-item-${getIdFromHash(
                                    item?.id?.tokenId
                                )}`}
                            >
                                <figure
                                    className="absolute inset-0 flex bg-antiFlashWhite p-4"
                                    style={{
                                        backgroundColor: `#${item?.metadata?.background_color}`,
                                    }}
                                >
                                    <Image
                                        className="m-auto max-h-[100%] w-auto"
                                        width="60"
                                        height="40"
                                        src={ipfsToHttps(
                                            item?.metadata?.image || ''
                                        )}
                                        alt={
                                            item?.metadata?.name ||
                                            'caveman silhouette'
                                        }
                                    />
                                </figure>
                            </button>
                        ))}
                    </div>
                )}
            </section>
            <section className="flex flex-col items-center justify-center bg-antiFlashWhite p-8 md:w-1/2">
                <NftCard data={nftData} />
            </section>
        </div>
    );
}

export default NFTGallery;
