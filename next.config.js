/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["api-cdn.myanimelist.net", "cdn.myanimelist.net"],
    },
    env: {
        BASE_URL:
            process.env.NEXT_PUBLIC_NODE_ENV == "development"
                ? process.env.NEXT_PUBLIC_BASE_URL_DEV
                : process.env.NEXT_PUBLIC_BASE_URL_PROD,
        MAL_URL: process.env.NEXT_PUBLIC_MAL_URL,
        AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        MAL_CLIENT_ID: process.env.MAL_CLIENT_ID,
        MAL_CLIENT_SECRET: process.env.MAL_CLIENT_SECRET,
        CODE_CHALLENGE: process.env.CODE_CHALLENGE,
    },
};

module.exports = nextConfig;
