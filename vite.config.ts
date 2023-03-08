import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/pokedexreact/',
	server: {
		host: true,
		open: false,
		strictPort: true,
		port: 5173,
	}
})
