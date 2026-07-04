# Project: TRC Homes — Single-Page Website

Home renovation company in Cork, Ireland. Single-page, scroll-driven marketing site targeting Cork homeowners (25–50) who bought an older house. Premium trust feel — €120k+ projects, not volume leads. Goal: enquiry form submission or phone call.

## Rules

- Always invoke the frontend-design skill before writing any frontend code.
- Read brand_assets/ before generating any UI.
- NEVER push to GitHub unless the user explicitly says "push" or "commit this" — no exceptions.
- Always test on localhost first.
- Use Puppeteer screenshots to verify static UI, stored in temp_screenshots/ with descriptive names.
- SKIP screenshot comparison for the scroll hero and any animated element — the user reviews those manually.
- Stop and ask before: deleting any file, installing any dependency, or changing the deployment setup.
- Plain HTML/CSS/JS only, no frameworks, no build step — must deploy to Vercel as static files.

## Tech notes

- Hero: scroll-driven video sequence — MP4 split into ~60–80 frames (ffmpeg), preloaded, scrubbed on a canvas via GSAP ScrollTrigger + Lenis smooth scroll from CDN.
- All animations MUST respect prefers-reduced-motion and simplify below 768px.
- Form and call button always reachable within one thumb-tap on mobile.
- Assets live in assets/ (hero MP4, logo). Brand guidelines in brand_assets/brand-guidelines.md.
- Vercel deployment is configured manually by the user — do not connect or change it.
