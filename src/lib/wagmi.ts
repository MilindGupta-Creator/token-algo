import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: 'YOUR_PROJECT_ID', // You can get this from WalletConnect Cloud
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: true,
})
