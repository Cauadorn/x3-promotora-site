import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // caminhos relativos: funciona no GitHub Pages (subpasta do repositório), Vercel, Netlify ou hospedagem comum
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    // site multipágina: cada entrada vira uma página no /dist
    rolldownOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        parceiro: resolve(import.meta.dirname, 'seja-parceiro-x3-promotora/index.html'),
      },
    },
  },
  // permite abrir o preview por um link temporário do Cloudflare Tunnel (npm run tunnel)
  preview: {
    port: 4173,
    allowedHosts: ['.trycloudflare.com'],
  },
});
