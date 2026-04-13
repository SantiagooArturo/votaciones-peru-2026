import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "resultadoelectoral.onpe.gob.pe",
            },
        ],
    },
};

export default nextConfig;
