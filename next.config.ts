import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.*', '192.168.1.*', '*.local'],
  serverExternalPackages: ['@neondatabase/serverless'],
};

export default nextConfig;
