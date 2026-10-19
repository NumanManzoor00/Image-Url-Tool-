# PixHost: free image hosting (Netlify)

Upload images, get a direct URL, see your recent uploads. Glassmorphism UI, dark mode, 4 languages (EN / UR / HI / ES), three.js hover effects.
Images are stored in **Netlify Blobs** (free tier, persistent). No database needed.

## Run locally (free)
```
npm install
npx netlify-cli dev      # opens http://localhost:8888
```
Local uploads work too (Netlify CLI emulates Blobs).

## Deploy (free)
1. Push this folder to GitHub, then Netlify > Add new site > Import from Git (publish dir `public`, functions `netlify/functions` are read from netlify.toml).
   or: `npx netlify-cli deploy --prod`
2. Done. Your site URL is the image host.

## Notes
- Max 5 MB per image (Netlify Functions request limit is about 6 MB).
- Real file type is checked from magic bytes; only PNG/JPG/GIF/WEBP are accepted.
- "Recent images" is stored in the visitor's browser (localStorage) together with a secret delete token.
- Vercel: this version uses Netlify Blobs, so use Netlify. For Vercel, swap the 3 functions to Vercel Blob (@vercel/blob).
