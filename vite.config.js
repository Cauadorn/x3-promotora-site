import { defineConfig } from 'vite';

export default defineConfig({
  // caminhos relativos: funciona no GitHub Pages (subpasta do repositório), Vercel, Netlify ou hospedagem comum
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
  // permite abrir o preview por um link temporário do Cloudflare Tunnel (npm run share)
  preview: {
    port: 4173,
    allowedHosts: ['.trycloudflare.com'],
  },
});
