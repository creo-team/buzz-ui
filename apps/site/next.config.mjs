/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@creo-team/buzz-ui'],
	webpack: config => {
		// The library uses explicit .js specifiers in TypeScript source
		// (native-ESM correct); map them back to .ts/.tsx when importing the
		// workspace source through the tsconfig path aliases.
		config.resolve.extensionAlias = {
			...config.resolve.extensionAlias,
			'.js': ['.ts', '.tsx', '.js'],
		}
		return config
	},
}

export default nextConfig
