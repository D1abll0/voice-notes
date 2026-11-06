// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
// 	plugins: [react(), tailwindcss()],
// 	worker: { format: 'es' },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Private Voice Notes',
				short_name: 'VoiceNotes',
				description: 'Voice notes transcribed and searched entirely in your browser.',
				theme_color: '#14213d',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{ src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,wasm,ttf}'],
				maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'onnx-runtime',
							cacheableResponse: { statuses: [0, 200] },
							expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
						},
					},
				],
			},
		}),
	],
	worker: { format: 'es' },
})