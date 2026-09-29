import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Allows isolated production verification beside an existing dev server.
    distDir: process.env.NEXT_DIST_DIR || ".next",
    experimental: {
        // Animates route changes wrapped in React's <ViewTransition>.
        viewTransition: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lta-dev-tl6j9mrplp.s3.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
