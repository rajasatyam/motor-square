/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['ik.imagekit.io'], 
  },
 async headers() {
    return [
      {
        source: "/embed",
        
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://motor-square.created.app;",
          },
        ],
      },
    ];
  },

};

export default nextConfig;
