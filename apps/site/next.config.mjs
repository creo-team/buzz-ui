/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	transpilePackages: ['@creo-team/buzz-ui'],
	compiler: {
		styledJsx: false,
	},
	skipMiddlewareUrlNormalize: true,
}

export default nextConfig

