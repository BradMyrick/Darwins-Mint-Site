"use client";

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import React, { useState, useEffect } from 'react';
import { publicProvider } from 'wagmi/providers/public';
import { goerli, mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Components
import Nav from '@/components/common/Nav';
import SectionHero from '@/components/sections/SectionHero';
import SectionMint from '@/components/sections/SectionMint';
import SectionRoadmap from '@/components/sections/SectionRoadmap/SectionRoadmap';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/context/UserContext';
import { ContractProvider } from '@/context/ContractContext';
import Footer from '@/components/common/Footer/Footer';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [
    publicProvider(),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY || '' }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      chains,
    }),
  ],
});

const queryClient = new QueryClient();

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <ContractProvider>
            <UserProvider>
              <main className="max-w-full overflow-x-hidden">
                <Nav />
                <SectionHero />
                {isClient && <SectionMint />}
                <SectionRoadmap />
              </main>
              <Footer />
            </UserProvider>
          </ContractProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </html>
  );
}
