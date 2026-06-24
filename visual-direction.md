# Visual Direction: High Art-Fashion Meets Digital
    
**Goal**: Make the LGIT Consult website feel like a high-end fashion/art publication that happens to be digital. Think Ssense editorial, 032c, Arena Homme+, or a Virgil Abloh deck — not a SaaS landing page.

---

## Current State (What's Working, What's Not)

**Working:**
- Glitch core system (circles, lines, index numbers on scroll) — strong conceptual foundation
- Dark mode support
- Geist font pairing (sans + mono)
- Clean component architecture

**Not working:**
- Default blue accent (#0070f3) reads as generic tech/SaaS
- Rounded corners everywhere (cards, buttons) — feels soft and startup-y
- Standard container widths and grid layouts — no tension, no editorial rhythm
- Every section looks the same: centered heading, paragraph, grid of cards
- No typographic hierarchy beyond font-size — everything uses the same weight/tracking
- Placeholder component (colored SVG boxes) breaks the tone completely
- No photography, no texture, no visual identity beyond the glitch effect

---

## 1. Color System Overhaul

Strip the palette down. High fashion is about restraint.

```
Light mode:
  --bg: #f8f7f4        (warm off-white, not clinical white)
  --fg: #111111        (near-black)
  --muted: #edecea     (warm grey)
  --accent: #111111    (black IS the accent — let typography do the work)
  --accent-contrast: #f8f7f4

Dark mode:
  --bg: #0c0c0c        (deep black)
  --fg: #e8e6e1        (warm off-white)
  --muted: #1a1918     (dark warm grey)
  --accent: #e8e6e1    (white IS the accent)
  --accent-contrast: #0c0c0c
```

No blue. No color. Color comes from photography and project work — the chrome is monochrome. If an accent color is ever needed (links, focus states), use a single muted tone — maybe `#8a8579` (warm mid-grey).

---

## 2. Typography as Design

Typography should carry the visual identity. The current setup uses Geist at one weight with size as the only differentiator. For a fashion/art feel, we need contrast.

**Proposal:**
- **Display type** (h1, hero text): Geist Sans at very light weight (100-200), large sizes (5xl-8xl), tight letter-spacing (`tracking-tighter`). Let it breathe. Uppercase optional for section labels.
- **Body type**: Geist Sans at regular weight (400), comfortable reading size, generous line-height (1.7-1.8).
- **Monospace accents**: Geist Mono for metadata, dates, index numbers, labels, nav items — gives the "digital systems" feel. Small size, uppercase, wide tracking (`tracking-[0.2em]`).
- **Mix weights aggressively**: A thin 80px headline next to a mono 11px label creates the fashion editorial tension.

**Examples:**
```
Hero:        "Where Technology Meets Creative Vision" — 6xl/7xl, font-light, tracking-tighter
Section:     "DIGITAL" — mono, 11px, uppercase, tracking-[0.2em], text-fg/40
Body:        Regular weight, 16-18px, max-w-prose
Card title:  font-medium, not font-bold
```

---

## 3. Layout & Spacing: Editorial Grid

Stop centering everything. Fashion editorial layouts use asymmetry, generous whitespace, and intentional misalignment.

**Key changes:**
- **Hero sections**: Full-width, left-aligned text with massive top/bottom padding (py-32 md:py-48). No image next to it — let the words own the space. Image below or on scroll.
- **Section spacing**: Double or triple the current padding. Whitespace is the luxury signal. `py-24 md:py-32` minimum between sections.
- **Asymmetric grids**: Instead of `grid-cols-2 gap-12`, use `grid-cols-12` with intentional offset: content in cols 1-7, sidebar detail in cols 9-12. Different sections use different column spans.
- **Full-bleed moments**: Some images/sections break out of the container and go edge-to-edge.
- **Break the rhythm**: Not every section should be heading → paragraph → grid. Vary it: large quote, then a wide image, then a compact two-column text block, then a full-width CTA with just one line of text.

---

## 4. Cards & Containers: Kill the Roundness

Current cards have `rounded-lg border border-fg/10 bg-bg p-6 shadow-sm` — this is friendly startup aesthetic.

**Proposal:**
- **No border-radius** on cards. Sharp corners. `rounded-none` or at most `rounded-sm`.
- **No box shadows**. Use borders or negative space to define areas.
- **Borders**: Thin, 1px, `border-fg/10`. Use top-border-only or bottom-border-only for a ruled-line editorial feel.
- **Remove card backgrounds** where possible — let content sit directly on the page with dividers between items, like a magazine layout.
- **Buttons**: Sharp corners (`rounded-none`), uppercase mono text, letter-spacing. Borders instead of fills for secondary actions. On hover: invert (bg becomes fg, text becomes bg).

---

## 5. The Glitch System: Evolve It

The glitch core (circles + lines + index numbers on scroll) is the strongest visual signature. Lean into it harder:

- **Persistent ambient effects**: Don't just trigger on scroll. Have 1-2 subtle static connections visible at all times on every page — like a background grid that occasionally pulses. Low opacity, slow animation.
- **Page transition glitch**: When navigating between pages, fire a burst of effects during the transition. Makes it feel like the system is reacting to navigation.
- **Index number system**: The numbered indices the glitch draws are conceptually strong — like a technical drawing or pattern sheet. Consider echoing this in the UI: number your services ("001 — Web Development"), number your values, number your process steps. Makes the glitch feel intentional, not decorative.
- **Line weight variation**: Currently all lines are 1px uniform. Vary weights — some connections thicker (2-3px), some hairline (0.5px). Creates depth.
- **Extend to images**: When implemented, let glitch lines connect to image edges, not just text. Creates a "blueprint overlay" feel.

---

## 6. Image Strategy (When Photography Comes In)

The site currently has one hero image and a bunch of Placeholder SVGs. When real photography arrives:

- **Full-bleed, high-contrast B&W** as the default treatment. Color photography reserved for case study detail pages.
- **No rounded corners on images**. Sharp, edge-to-edge.
- **Overlay treatment**: Subtle grain or noise texture over images — breaks the digital perfection, adds analog feel.
- **Image sizing**: Go big. Hero images should be full viewport height or close to it. Thumbnails should be generous (not tiny card images).
- **Mix scales**: A massive full-bleed image followed by a tight grid of small detail shots. Fashion editorial rhythm.

---

## 7. Micro-Interactions & Motion

Current motion is uniform `fadeIn` with y:20 offset on everything. It's fine but forgettable.

**Proposal:**
- **Staggered reveals**: Text lines reveal word-by-word or line-by-line with slight stagger, not whole blocks at once.
- **Horizontal movement**: Some elements slide in from the left or right, not just up. Creates more dynamic compositions.
- **Parallax on scroll**: Subtle — images move at 0.8x scroll speed, text at 1x. Just enough to create depth.
- **Hover states**: Cards/links don't just change color — they shift slightly, or a line extends from them (echoing the glitch system).
- **Cursor**: Consider a custom cursor on desktop — a small crosshair or dot, reinforcing the precision/technical aesthetic.

---

## 8. Navigation Refinement

The navbar is functional but standard. For this aesthetic:

- **Thin and minimal**: Reduce height. Logo left, nav items right, all in mono uppercase with wide tracking.
- **Dropdown**: The services dropdown should feel like a panel — full-width or half-width, with generous padding, not a cramped flyout.
- **Mobile menu**: Full-screen overlay with large type, stacked vertically. Each item numbered (01, 02, 03...). Fade in with stagger.

---

## 9. Section Label System

Borrow from fashion lookbooks and technical documents — every section gets a systematic label:

```
001 — FEATURED WORK
002 — DIGITAL SERVICES
003 — CREATIVE CONSULTING
004 — ABOUT
005 — JOURNAL
```

Rendered in Geist Mono, small, uppercase, wide-tracked, positioned at the top-left of each section. The glitch index numbers already do something similar — this makes the whole system coherent.

---

## 10. Implementation Priority

| Phase | What | Impact |
|-------|------|--------|
| 1 | Color system + typography overhaul (globals.css + component classes) | Highest — transforms the entire feel immediately |
| 2 | Card/button redesign (sharp corners, borders, mono labels) | High — removes the startup look |
| 3 | Layout restructure (asymmetric grids, editorial spacing, section labels) | High — creates the editorial rhythm |
| 4 | Glitch system enhancements (ambient effects, numbering system, varied weights) | Medium — strengthens the signature |
| 5 | Motion refinements (staggered text, parallax, hover lines) | Medium — adds polish |
| 6 | Navigation redesign (mono labels, full-screen mobile, panel dropdown) | Medium — completes the system |
| 7 | Image treatment system (when photography arrives) | Deferred — needs real assets |

---

## References & Mood

Visual touchpoints (not to copy, but to calibrate the tone):

- **032c Magazine** — editorial grid, monochrome, sharp typography
- **Ssense Editorial** — fashion meets digital, generous whitespace, large type
- **Virgil Abloh / Off-White** — quotation marks, index systems, blueprint aesthetic
- **Rick Owens online store** — brutalist minimalism, no color, all texture
- **Acne Studios** — restrained, warm neutrals, typographic identity
- **Mugler campaigns** — high contrast, dramatic, digital-meets-physical

The common thread: **restraint as luxury, systems as aesthetic, tension between analog and digital**.
