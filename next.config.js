/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com", 'source.unsplash.com',],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
                pathname: "/v0/b/final-capstone-project-f8bdd.appspot.com/o/**",
            },
        ],
    },
};

    module.exports = nextConfig;
