import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// Supported chain IDs
export const supportedChainIds = [1, 5]; // Mainnet and Goerli

// MetaMask connector
export const injected = new InjectedConnector({
  supportedChainIds,
});

// WalletConnect connector
export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    5: 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

// Connector mapping
export const connectorsByName = {
  MetaMask: injected,
  WalletConnect: walletconnect,
};