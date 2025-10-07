import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import optimizeLocales from '@react-aria/optimize-locales-plugin';

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8090',
			},
		},
	},
	plugins: [
		tailwindcss(),
		{
			...optimizeLocales.vite({
				locales: ['en-US', 'de-AT', 'de-DE', 'de-CH'],
			}),
			enforce: 'pre',
		},
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
	],
});
