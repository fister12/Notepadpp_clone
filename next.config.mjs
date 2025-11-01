/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Vercel
  output: 'standalone',
  
  // Disable server components for Monaco Editor compatibility
  experimental: {
    esmExternals: 'loose',
  },
  
  // Handle Monaco Editor CSS properly
  transpilePackages: ['monaco-editor'],
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Handle Monaco Editor worker files
      config.output.publicPath = `/_next/`;
      
      // Monaco Editor requires these loaders
      config.module.rules.push({
        test: /\.ttf$/,
        type: 'asset/resource',
      });
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
  },
  
  // Redirects and headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
