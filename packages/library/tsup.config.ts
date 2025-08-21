import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/server.ts', 'src/client.ts'],
	format: ['esm', 'cjs'],
	dts: false,
	clean: true,
	sourcemap: true,
	splitting: false,
	treeshake: true,
	external: ['react', 'react-dom', 'next/navigation', 'next/headers', 'react-hot-toast', 'framer-motion', 'react-hotkeys-hook'],
})

