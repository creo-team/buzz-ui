/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// The site consumes the built workspace package (dist + exports map), the
	// same artifact npm consumers install — no transpilation or resolution
	// shims needed. `prebuild` keeps dist fresh; use `npm run dev` at the repo
	// root to watch-rebuild the library alongside next dev.
}

export default nextConfig
