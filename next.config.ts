import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
    // Completely disable ESLint during builds
    ignoreDuringBuilds: true,
    },
typescript: {
    // ⚠️ Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
    devIndicators: false,
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ufs.sh',
                port: '',
                pathname: '/f/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/f/**',
                search: '',
            },
        ],
    }
};

export default nextConfig;
