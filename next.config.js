/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withTM = require('next-transpile-modules')(["react-icons"]);

module.exports = nextConfig
module.exports = withTM({})

