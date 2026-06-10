# El Bayt El Djazairi — Premium Landing Polish (Design Spec)

**Date:** 2026-06-08
**Status:** Approved (direction + scope)
**Goal:** Elevate the existing landing page into a premium, "cinematic luxury"
experience worth its commercial value — without changing the content,
information architecture, or the WhatsApp/order/Supabase flows.

## Direction (approved)

- **Aesthetic:** Cinematic luxury — keep the gold-on-near-black brand soul; add
  depth, refined typographic rhythm, and atmosphere. Light theme keeps the same
  intent in warm ivory.
- **Motion:** Tasteful & smooth (Emil Kowalski style) — one orchestrated hero
  entrance, purposeful micro-interactions, buttery easing. Never gimmicky.
- **Scope:** Targeted high-impact polish — elevate the moments that sell, keep
  the current structure and flows.

## Non-goals / constraints

- Do **not** change: section order/content, catalog data, i18n copy, wilaya
  data, API routes, Supabase schema, WhatsApp message formats, cart/order logic.
- Preserve: Arabic-RTL-first with FR/EN, light/dark theming, the Renault priced
  product + price system, accessibility (focus states, keyboard, contrast).
- Everything must honor `prefers-reduced-motion` (animations collapse to instant).
- No regressions to `npm run build` / lint / types.

## Work areas

### 1. Atmosphere & foundation
- Layered gold "aurora" glow accents behind hero + section seams (low-opacity,
  theme-aware); refined vignette; keep film grain.
- Gradient gold hairline dividers between major sections.
- Tighter, more deliberate type scale + vertical rhythm; tracked uppercase
  eyebrow labels; gold `::selection`.

### 2. Hero (signature moment)
- Orchestrated entrance: badge → headline (line-by-line) → subhead → CTAs on a
  spring/stagger; animated gold-shimmer sweep on the accent word.
- Slow Ken-Burns drift on the hero image; refined scrim + gold radial.
- Trust-chip row (made in Algeria • delivery to 58 wilayas • delivery & install).
- Elegant animated scroll cue.

### 3. Navigation
- Glass nav refines on scroll (blur/shadow/condense); animated gold underline on
  hover; **scroll-spy** active-section highlight; subtle **magnetic** primary CTA.

### 4. Product cards
- Image hover: gentle zoom + soft gold sheen sweep; confident gold price tag;
  springy press states; staggered reveal on enter. Priced/featured ribbon.

### 5. Section rhythm & stats
- Eyebrow labels + staggered reveals (shared easing); **count-up** stat numbers
  when scrolled into view (reduced-motion → final value immediately).

### 6. Gallery, fabrics & modals
- Hover caption slide-up + gold corner accents; lightbox crossfade + subtle zoom,
  arrow/Esc nav; modals spring in.

### 7. Micro-interactions
- Button spring press, soft shadow lift + gold glow on primary; accessible
  gold `:focus-visible` rings; refined toast; smooth theme color crossfade.

## Technical approach

- Add **`motion`** (Framer Motion) for the hero orchestration, card/modal
  springs, and count-ups. Keep the existing CSS + IntersectionObserver `Reveal`
  for simple section reveals to keep JS light.
- Centralize easing/spring tokens and a `useReducedMotion` guard.
- New small components/hooks: `MotionReveal`, `CountUp`, `useScrollSpy`,
  `useMagnetic`, `Aurora`/divider primitives. Keep each focused and isolated.
- Apply `ui-ux-pro-max` (hierarchy, spacing, color, type) and `emil-design-eng`
  (animation decisions, restraint, detail) guidance during implementation.

## Success criteria

- The hero has a clear "wow" entrance; the page feels cohesive, deliberate, and
  high-end in both themes and in AR/FR/EN.
- All interactions are smooth (good easing, no jank), keyboard- and
  reduced-motion-accessible.
- `npm run build`, lint, and type-check pass; no flow/behavior regressions.
