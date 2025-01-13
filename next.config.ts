/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.EXPORT_STATIC === "true" ? "export" : undefined,
  basePath: "/jogo-da-velha",
  trailingSlash: true,
};

export default nextConfig;
