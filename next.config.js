/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com", 'source.unsplash.com',],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
                pathname: "/v0/b/prn221-save-image.appspot.com/o/**",
            },
        ],
    },
};

    module.exports = nextConfig;
