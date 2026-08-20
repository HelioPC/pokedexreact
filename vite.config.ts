/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Matches the GitHub Pages path, so dev and production share the same base.
export default defineConfig({
	plugins: [react()],
	base: '/pokedexreact/',
	server: {
		host: true,
		open: false,
		strictPort: true,
		port: 5173,
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id: string) {
					if (!id.includes('node_modules')) return

					if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'chart'
					if (id.includes('framer-motion')) return 'motion'
					if (id.includes('react-router')) return 'router'
					if (id.includes('styled-components')) return 'styled'
					if (id.includes('/react-dom/') || id.includes('/react/')) return 'react'
				},
			},
		},
	},
})
