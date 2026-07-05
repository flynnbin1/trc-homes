# TRC Homes — Website Specification

## 1. Overview

Single-page, scroll-driven marketing site for TRC Homes, a home renovation company in Cork, Ireland. Premium trust feel — €120k+ projects, not volume leads.

## 2. Audience & Goal

Cork homeowners aged 25–50 who bought an older house, arriving from ads. They should understand TRC handles full renovations under one roof, then submit an enquiry or call.

## 3. Tech Stack & Constraints

- Plain HTML/CSS/JS only — no frameworks, no build step; deploys to Vercel as static files.
- GSAP ScrollTrigger + Lenis smooth scroll, loaded from CDN.
- Hero imagery: five renovation keyframes in `assets/keyframes/web/` — WebP tiers at 1284px / 1920px / 2880px, chosen by physical screen resolution. Source PNGs stay in `assets/` untouched.
- All animations respect `prefers-reduced-motion` and simplify below 768px.
- Form and call button always reachable within one thumb-tap on mobile.

## 4. Page Sections (in order)

1. HERO — five-keyframe wipe scrub
2. THE SITUATION — short lines appearing on scroll
3. SERVICES — cards with gold keystone accents
4. GRANTS — "We handle the grant paperwork"
5. HOW IT WORKS — enquire → free consultation → plan → build
6. PROOF — project photos placeholder
7. CTA — form placeholder + phone button, Deep Pine footer

## 5. Hero — Five-Keyframe Wipe Scrub

- Full-viewport pinned hero. Five keyframes of the same house (as bought → works begin → structure → late build → finished home) reveal in sequence as the user scrolls: each stage holds, then the next wipes in left-to-right behind a fine 1px Muted Gold edge. Wipes, not crossfades — the keyframes are not camera-registered, so overlapping opacities ghost. GSAP ScrollTrigger + Lenis from CDN.
- Stage mapping: the five stages play across the first ~85% of the pin distance; the finished home holds for the final ~15% (the settle) before the page releases.
- Stage markers: 01–05 on the hero's right edge (Jost 500 numbers + fine rules, gold active state, slight Deep Pine text-shadow for legibility). Pressing a number scrolls the pin to that stage; markers track the scrub live. Hidden under reduced motion.
- Two-beat pinned headline (Marcellus, H1 scale): "You've bought the house." through the early stages, crossfading (opacity only — text has no registration problem) to "Now make it home." as the finished home arrives.
- Subline "Full renovations, extensions and retrofits across Cork." (Jost 400) and button "FREE CONSULTATION" (Jost 500, 14px, caps, gold 1px border) below the headline — visible from first paint, never waiting for images.
- Subtle Deep Pine gradients only: slim top band for nav legibility, soft bottom-left pool behind the copy — must not muddy the imagery.
- 1px Muted Gold progress hairline at the hero's bottom edge, tracking scrub progress.
- Loading: stage 1 eager, stages 2–5 stream in behind it; the scrub never shows a gap while images load.
- Image sets: WebP tiers at 1284px / 1920px / 2880px in `assets/keyframes/web/`, selected by viewport width × devicePixelRatio so no screen ever upscales.
- Reduced motion: no pin, no wipes — static finished-home image with "Now make it home.", subline and button.
- Below 768px: shorter pin distance, same wipe sequence (tier selection handles image size).

## 6. Content Sections

- THE SITUATION: short lines fading in on scroll, speaking to the "bought a dated house" moment. Off-White canvas.
- SERVICES: six cards — extensions, full renovations, retrofitting, solar, heat pumps, one-stop-shop grants — on Stone panels with fine gold keystone accents.
- GRANTS: one-stop-shop scheme front and centre.
- HOW IT WORKS: four steps with the free consultation visually centred as the key step.
- PROOF: styled placeholder grid, ready for client photos later without redesign.

## 7. CTA & Footer

Enquiry form placeholder, tap-to-call phone button, Cork service area, Deep Pine footer. Persistent call/enquire bar on mobile.

## 8. Colour

See `brand_assets/brand-guidelines.md` and `brand_assets/TRC Homes Brand Colours.pdf`. Balance: Off-White 55% / Stone 15% / Forest Green 22% / Deep Pine 5% / Gold 3%.

## 9. Typography

Locked to `brand_assets/TRC Homes Typography Card.pdf` — these exact values override any previous type suggestions.

- **Marcellus** (weight 400 only, Google Fonts): H1–H3, page titles, pull quotes, large numbers. Caps settings: letter-spacing 0.15–0.25em.
- **Jost** (weights 400 and 500 only, Google Fonts): body, navigation, buttons, captions, labels. Eyebrow labels: Jost 500, caps, letter-spacing 0.25–0.3em.

Type scale:

| Role | Font | Size |
|---|---|---|
| H1 | Marcellus 400 | 56px |
| H2 | Marcellus 400 | 38px |
| H3 | Marcellus 400 | 27px |
| Eyebrow | Jost 500 | 12px |
| Body | Jost 400 | 17px |
| Buttons | Jost 500, caps | 14px |

Load only these weights from Google Fonts: Marcellus 400, Jost 400/500 — nothing else.

## 10. Design Direction — Premium Standard

The reference quality is a high-end architecture studio site, not a lead-gen template. Think printed brochure for a €120k project: restraint, space, typography.

### Space & Layout

- Whitespace is the premium signal: section padding 120px+ desktop, 64px+ mobile
- Asymmetric editorial layouts where natural — not every section centred
- Max content width ~1200px, text measure 65–75 characters
- Fine 1px rules in Muted Gold as separators — never heavy borders, never drop-shadow-heavy cards

### FORBIDDEN — never use any of these

- Purple/blue gradients, glassmorphism, neon glows, floating blobs
- Emoji anywhere in the UI
- Generic icon sets (no Font Awesome-style icon rows); use numbers, fine rules, or typography instead
- Rounded-corner card grids with identical drop shadows (the "SaaS template" look)
- Stock-photo placeholder aesthetics, lorem ipsum left visible
- Bouncy/springy animations, elements flying in from off-screen, parallax on everything
- Gradient text, oversized border-radius (max 2px — this brand is sharp-cornered)
- "Trusted by" logo strips, star-rating clusters, fake urgency elements

### Motion

- Animations are quiet: opacity and small translate (12–24px) only, 0.6–0.9s ease-out, generous stagger
- One signature moment (the hero scrub) — everything else is calm
- Nothing moves that doesn't need to

### Colour Discipline

- Hold the 55/15/22/5/3 balance. Large calm fields of Off-White and Stone; Forest Green as ink, not decoration; Gold only as 1px rules, keystone squares, and micro-labels

Typography rules live in section 9 — do not duplicate them here.

## 11. Motion & Accessibility

- `prefers-reduced-motion`: all scroll animation replaced with static equivalents.
- Below 768px: simplified animations.
- Contrast checked for gold-on-green and text over photo overlays.

## 12. Verification & Workflow

- frontend-design skill invoked before any frontend code; brand_assets/ read before any UI.
- Puppeteer screenshots for static UI into `temp_screenshots/` with descriptive names; scroll hero and animated elements reviewed manually by the user.
- Test on localhost first. Never push to GitHub without explicit instruction.

## 13. Deployment

Vercel as static files, connected manually by the user. Claude does not touch deployment.
