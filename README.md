# Landing Casino — Vercel Ready

## Quick Start
1. Install deps: `npm install`
2. Run dev: `npm run dev`
3. Build: `npm run build`
4. Deploy on Vercel:
   - Connect GitHub and import this repo, or
   - Use Vercel CLI: `vercel` then `vercel --prod`

## Meta Pixel
- Pixel ID already added in `index.html` (2257303394731974). Fires `PageView` on load.

## WhatsApp
- Phone is set to +1 616 207 1727 (URL format without plus). Update in `src/LandingCasino.tsx` if needed.
- Clicks fire `Contact` and custom `WhatsAppClick` events.

## Tech
- Vite + React + TypeScript + TailwindCSS
