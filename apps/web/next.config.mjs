/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@streamcanvas/core", "@streamcanvas/react", "@streamcanvas/server"],
};

export default nextConfig;
