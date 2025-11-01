/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Optimize for Monaco Editor
  experimental: {
    esmExternals: 'loose',
  },
  // Handle Monaco Editor CSS properly
  transpilePackages: ['monaco-editor'],
};

export default nextConfig;
