---
name: Carousel Design System
description: Auto-activates during carousel generation to enforce premium visual quality. Prevents generic AI aesthetics by requiring aesthetic commitment, banning cliches, and ensuring visual differentiation.
version: 1.0.0
---

# Carousel Design System

This skill activates automatically when generating carousels. It ensures every carousel has a distinct visual identity and avoids the generic, same-looking output that AI tends to produce.

## When This Activates

During `/carousel:generate`, AFTER content strategy (Step 1) and BEFORE Gemini SVG calls (Step 2), apply this skill to determine the visual direction.

## Step 1: Determine Aesthetic Direction

Read the brand profile's style/tone and commit to ONE specific aesthetic. Do not blend or hedge — pick a direction and execute it fully.

### Aesthetic Directions

**MINIMALIST** (Preset: Minimalist, Tone: professional)
*Think: Dieter Rams, Apple keynotes, Muji*
- Maximum 3 visual elements per slide — every element must earn its place
- Text IS the design — huge headlines (96px+), surgical spacing
- Color: monochrome + ONE accent moment per slide, never more
- Containers: outlines only (stroke, no fill) or no containers at all
- Data: numbers speak for themselves — big, clean, no decoration
- Whitespace: 50%+ of canvas EMPTY — this is the luxury signal
- NO glass morphism, NO gradients on text, NO decorative elements
- If it doesn't serve the message, delete it

**BOLD** (Preset: Bold, Tone: bold/provocative)
*Think: Nike, Spotify Wrapped, Stripe annual reports*
- Oversized type: headlines 96-120px, key metrics 120-160px
- Full-bleed accent color blocks — not timid borders, SOLID fills
- Containers: solid accent fill with white/light text inside
- Data: BIG bars, BIG numbers, HIGH contrast — impossible to miss
- Color: accent color used HEAVILY (30-40% of visible area)
- Whitespace: intentional density — pack where it matters, breathe where it doesn't
- At least one "impossible to ignore" element per slide
- Glass morphism FORBIDDEN — use solid shapes with hard edges
- Impact > subtlety. If someone scrolling fast can't read it, make it bigger.

**EDITORIAL** (Preset: Editorial, Tone: professional/educational)
*Think: Monocle, Kinfolk, Bloomberg Businessweek, The Economist*
- Serif headlines MANDATORY — this IS the look
- Pull-quote styling on key statements (large italic serif, thin rule above/below)
- Thin hairline dividers between sections (0.5-1px, muted color)
- Data: elegant tables and refined charts, never flashy
- Color: muted palette with ONE warm accent — restraint is sophistication
- Layout: magazine-style — vary between full-width, 2-column, and sidebar layouts
- Small caps for categories and labels (letter-spacing: 0.15em)
- NO bold accent blocks, NO glass morphism — clean typography and rules only
- Feels like opening a premium magazine, not scrolling social media

**CORPORATE** (Preset: Corporate, Tone: professional)
*Think: IBM, McKinsey, Stripe, Linear*
- Grid-locked precision — EVERYTHING snaps to 24px grid
- Data tables and charts are the HERO — not decoration
- Color: restrained — primary + one accent, gradients only on charts
- Icons: simple line icons, consistent 2px stroke width throughout
- Badges with small border-radius (4-8px) for categories
- Section headers with accent underline (not full background)
- Footer with company branding on every slide
- NO decorative elements, NO organic shapes — everything geometric and purposeful
- Feels like a premium consulting deck, not a social media post

**NEON/TECH** (Preset: Neon/Tech, Tone: casual/bold)
*Think: Vercel, GitHub Universe, Figma Config, terminal culture*
- Monospace font for data, labels, and categories
- Terminal aesthetic: > prompt cursors, _ blink underscores, // code comments as labels
- Accent color at FULL SATURATION — neon glow effect (try adding a blurred rect behind key text)
- Dark containers with BRIGHT borders only (stroke="accent", no fill)
- Data: code-style output → `key: value` pairs, `[array, items]`, progress ████░░
- Subtle dot-grid or scan-line pattern in background (if brand-assets supports it)
- Pill badges with monospace text for tags/categories
- NO serif fonts, NO soft colors — everything hard-edged and digital
- Feels like a developer conference talk, not a marketing deck

## Step 2: Choose a Visual Signature

Every carousel needs ONE visual motif that repeats across all slides — the thing that makes this carousel recognizable as a SET, not 5 random images.

Pick ONE from these categories (or invent your own):

**Layout signatures:**
- Accent bar on the left side of every container (3-4px solid)
- Diagonal stripe in the top-right corner of every slide
- Consistent circle motif (data in circles, icons in circles)
- Bottom accent line across full width on every slide

**Typography signatures:**
- First word of every headline in a different weight or the display font
- Key number on every slide uses the brand gradient
- Category labels always in small-caps pill badges
- Pull-quote marks « » around key statements

**Color signatures:**
- Each slide gets a slightly different shade of the accent (tint progression)
- Accent color used as a highlight bar behind one word per headline
- Numbered slides with the number in a large accent-colored circle
- Alternating container treatments (slide 2 has borders, slide 3 has fills, etc.)

Include the chosen signature in EVERY slide's Gemini prompt:
"Visual signature for this carousel: {description}. Apply it consistently to this slide."

## Step 3: Anti-Pattern Enforcement

Include these in EVERY Gemini prompt — they are NON-NEGOTIABLE:

```
CAROUSEL ANTI-PATTERNS — NEVER DO THESE:
1. Identical glass morphism containers on every slide (boring — vary the treatment)
2. All text the same size with no hierarchy (make headlines COMMAND attention)
3. Centered everything (break the center — use left-align, asymmetry, offset)
4. Faint, barely-visible elements at 0.03-0.04 opacity (COWARDLY — commit to visible or remove)
5. Generic progress bars for every data point (LAZY — use varied visualizations)
6. Same layout structure repeated across slides (CAROUSEL FATIGUE — each slide should surprise)
7. Decorative elements that don't relate to the content (FILLER — every shape should mean something)
8. Gradient on every headline keyword (AI CLICHE — use it once or not at all)
9. Perfect symmetry on every slide (LIFELESS — asymmetry creates energy)
10. Safe, mid-tone colors that don't commit to light or dark (MUDDY — pick a side)
```

## Step 4: Inject Into Generation

When filling the Gemini visual prompt, add these to the `{{AESTHETIC_RULES}}` placeholder:

1. The aesthetic direction rules (from Step 1)
2. The visual signature instruction (from Step 2)
3. The anti-patterns list (from Step 3)

These go AFTER the framework instructions and BEFORE the spacing/output section.

## Quality Check

After all slides are generated, verify:
- [ ] Each slide has the visual signature applied
- [ ] No two slides have identical layouts
- [ ] The aesthetic direction was followed (e.g., Bold slides have big type, not subtle type)
- [ ] None of the 10 anti-patterns are present
- [ ] Accent color is visibly used (not just 1-2 gradient elements)
- [ ] There's clear visual hierarchy on every slide (one dominant element)
