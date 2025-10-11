import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'
import withTM from 'next-transpile-modules'
import withBundleAnalyzer from '@next/bundle-analyzer'

// STEP 0 — Setup des transpilers
const withTranspile = withTM([
  'react-markdown',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-sollet',
])

// STEP 1 — Config Next de base
let config: NextConfig = {
  webpack: (cfg, { isServer }) => {
    // WebAssembly & SVG
    cfg.experiments = { asyncWebAssembly: true, layers: true }
    cfg.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // ✅ Fix TypeScript-safe fallback
    if (!cfg.resolve) cfg.resolve = {}
    if (typeof cfg.resolve.fallback !== 'object') {
      cfg.resolve.fallback = {}
    }
    if (!isServer) {
      cfg.resolve.fallback = {
        ...cfg.resolve.fallback,
        fs: false,
      }
    }

    return cfg
  },

  pageExtensions: ['mdx', 'md', 'jsx', 'tsx', 'api.ts'],
  reactStrictMode: true,
  productionBrowserSourceMaps: true,

  env: {
    MAIN_VIEW_SHOW_MAX_TOP_TOKENS_NUM: process.env.MAIN_VIEW_SHOW_MAX_TOP_TOKENS_NUM,
    DISABLE_NFTS: process.env.DISABLE_NFTS,
    REALM: process.env.REALM,
    MAINNET_RPC: process.env.MAINNET_RPC,
    DEVNET_RPC: process.env.DEVNET_RPC,
    DEFAULT_GOVERNANCE_PROGRAM_ID: process.env.DEFAULT_GOVERNANCE_PROGRAM_ID,
  },

  async rewrites() {
    return [
      {
        source: '/openSerumApi/:path*',
        destination: 'https://openserum.io/api/serum/:path*',
      },
    ]
  },
}

// STEP 2 — Analyzer
config = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(config)

// STEP 3 — Sentry (dernière étape obligatoire pour sourcemaps)
if (process.env.SENTRY_AUTH_TOKEN) {
  config = withSentryConfig(config, { silent: true })
}

// STEP 4 — Export final
export default withTranspile(config)
