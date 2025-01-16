import { NextConfig } from 'next';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Include node-polyfill plugin to handle node modules in the browser
      config.plugins = [...config.plugins, new NodePolyfillPlugin()];

      // Exclude problematic node modules on the client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        readline: false,
        buffer: require.resolve('buffer'), // Polyfill for `node:buffer`
        worker_threads: false, // Disable worker_threads for the client-side
      };

      // Exclude the 'commander' module from the client-side
      config.externals = config.externals || [];
      config.externals.push({
        commander: 'commonjs commander',
      });
    }

    return config;
  },
};

export default nextConfig;
