// import type { Chain } from 'wagmi';
import { createClient, configureChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
// import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { bscTestnet, bsc } from 'wagmi/chains';
import { IsTestNet } from '@/envs';

const { chains, provider, webSocketProvider } = configureChains(
  [IsTestNet ? bscTestnet : bsc],
  // [bsc, bscTestnet],
  [
    // jsonRpcProvider({
    //   rpc: (chain) => {
    //     if (chain.id !== bscTestnet.id) return null;
    //     return {
    //       http: 'http://data-seed-prebsc-1-s1.binance.org:8545',
    //     };
    //   },
    // }),
    publicProvider(),
  ],
);

export class ClientService {
  static client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
    connectors: [
      // new InjectedConnector({ chains }),
      new MetaMaskConnector({
        chains,
      }),
      new WalletConnectLegacyConnector({
        chains,
        options: {
          // projectId: 'abc',
          qrcode: true,
        },
      }),
    ],
  });

  static isAvailableChain(chainId: number) {
    return this.client.chains?.some((item) => item.id === chainId);
  }
}
