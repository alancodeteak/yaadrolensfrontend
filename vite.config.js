import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const INTER_FONT_WEIGHTS = ['400', '500', '600', '700']
const analyzeBundle = process.env.ANALYZE === 'true'

/** Preload bundled Inter woff2 + load main CSS without render-blocking. */
function optimizeProductionHtml() {
  return {
    name: 'optimize-production-html',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html

        let output = html

        const fontFiles = Object.keys(ctx.bundle).filter(
          (file) =>
            file.endsWith('.woff2') &&
            INTER_FONT_WEIGHTS.some((weight) => file.includes(`inter-latin-${weight}`))
        )

        if (fontFiles.length) {
          const fontTags = fontFiles
            .map(
              (file) =>
                `    <link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin />`
            )
            .join('\n')
          output = output.replace('</head>', `${fontTags}\n  </head>`)
        }

        // Defer full Tailwind bundle — critical CSS is inlined in index.html
        output = output.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
          (_, href) => `    <link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="${href}" /></noscript>`
        )

        return output
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    optimizeProductionHtml(),
    analyzeBundle &&
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        open: false,
      }),
  ].filter(Boolean),
  preview: {
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome90',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('react-router') ||
            id.includes('react-redux') ||
            id.includes('@reduxjs/toolkit')
          ) {
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
