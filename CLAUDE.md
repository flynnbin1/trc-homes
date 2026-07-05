# Project: TRC Homes — Single-Page Website

WEBSITE-SPEC.md is the single source of truth for this project. Read it fully before any UI or content work. If a request conflicts with the spec, flag it and ask — do not silently override the spec.

Home renovation company in Cork, Ireland. Single-page, scroll-driven marketing site targeting Cork homeowners (25–50) who bought an older house. Premium trust feel — €120k+ projects, not volume leads. Goal: enquiry form submission or phone call.

## Rules

- Always invoke BOTH the frontend-design skill and the design-taste-frontend skill before writing any frontend code. design-taste-frontend's dials are overridden to match spec §10 restraint (approx. variance 6, motion 3, density 3), and its React/Tailwind defaults are overridden by this project's plain HTML/CSS/JS stack.
- The taste-skill design skills (design-taste-frontend and variants) may be used for craft — layout quality, spacing, motion polish — but WEBSITE-SPEC.md always wins on any conflict: no dark mode, locked Marcellus/Jost typography and type scale, locked colour palette and 55/15/22/5/3 balance, section 10 forbidden-patterns list, and no design systems or fonts beyond what the spec names. Where taste-skill and the spec disagree, follow the spec and note the conflict.
- Read brand_assets/ before generating any UI.
- NEVER push to GitHub unless the user explicitly says "push" or "commit this" — no exceptions.
- Always test on localhost first.
- Playwright screenshot verification is PAUSED — do not run it unless the user explicitly asks. Verify statically via code/console checks only.
- SKIP screenshot comparison for the scroll hero and any animated element — the user reviews those manually.
- Stop and ask before: deleting any file, installing any dependency, or changing the deployment setup.
- Plain HTML/CSS/JS only, no frameworks, no build step — must deploy to Vercel as static files.
- Typography is locked: Marcellus 400 (H1–H3, pull quotes, large numbers only) and Jost 400/500 (everything else), exact scale per WEBSITE-SPEC.md section 9 and brand_assets/TRC Homes Typography Card.pdf. Load no other fonts or weights.
- Section 10 of WEBSITE-SPEC.md (Design Direction — Premium Standard) is binding for all UI work, including its forbidden-patterns list.
- Component libraries and UI marketplaces (21st.dev/Magic MCP or similar) may be consulted for interaction-pattern reference ONLY. Never paste or port their markup, CSS, or components into this project — all UI is built from scratch within the spec's system. WEBSITE-SPEC.md sections 9 and 10 override any external pattern.

## Tech notes

- Hero: five-keyframe wipe scrub — renovation-stage images in assets/keyframes/web/ (1284/1920/2880px WebP tiers picked by screen resolution), pinned via GSAP ScrollTrigger + Lenis from CDN; each stage wipes in behind a 1px gold edge (no crossfades — frames aren't camera-registered); ~85% stage mapping with ~15% settle; clickable 01–05 stage markers; prefers-reduced-motion gets a static finished-home fallback.
- All animations MUST respect prefers-reduced-motion and simplify below 768px.
- Form and call button always reachable within one thumb-tap on mobile.
- Assets live in assets/ (keyframe source PNGs + web sets in assets/keyframes/web/, logo SVGs). Brand guidelines in brand_assets/.
- Vercel deployment is configured manually by the user — do not connect or change it.
