/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

const nextConfig = {
    experimental: {
        serverActions: true,
    },

    images: {
        remotePatterns: [
            {
                hostname: 'i.ytimg.com',
            },
            {
                hostname: 'github.com'
            }
        ],
    },

    ...withPWA({
        dest: 'public',
        register: true,
        skipWaiting: true
    })
}

module.exports = nextConfig
