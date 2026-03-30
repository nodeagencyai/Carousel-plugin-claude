---
name: carousel:backgrounds
description: Generate premium branded background images for your carousel slides using AI. Creates hero and content backgrounds that match your brand identity.
---

# Background Generator

Generate beautiful, branded background images for your carousels. These get embedded into every slide as the base layer, replacing flat colors with rich, textured backgrounds.

## How It Works

1. Read `brand-profile.json` for brand colors and design mode
2. Use Gemini via OpenRouter to generate TWO background images:
   - **Hero background** (slide 1) — more dramatic, eye-catching
   - **Content background** (slides 2+) — subtler, lets content breathe
3. Save as PNGs in `./brand-assets/backgrounds/`
4. Update brand-profile.json to reference them

## Background Generation

### Step 1: Prepare the prompt

Build a Gemini image generation prompt based on the brand profile:

For **dark mode** brands:
```
Generate a premium dark background image for a social media carousel slide.
Dimensions: 1080x1350 pixels.
Primary color: {background_color} (e.g., #0A0A0A)
Accent color: {accent_color} (e.g., #FF4D4D)

Style: [HERO variant]
- Subtle gradient from the primary dark color
- A gentle radial glow of the accent color at ~10-15% opacity, positioned at top-center
- Subtle noise/grain texture throughout
- NO text, NO logos, NO objects — pure abstract background
- The top 280px should be slightly darker (logo zone)
- The bottom 250px should have a subtle horizontal line or gradient shift (footer zone)
- Premium, moody, sophisticated — think Apple keynote stage lighting

[CONTENT variant]
- Same dark base but MORE subtle than hero
- Very gentle accent color presence (~5% opacity glow)
- Consistent noise/grain texture
- Designed to let text content be the focus
- Same top/bottom zone treatment
```

For **light mode** brands:
```
Generate a premium light background image for a social media carousel slide.
Dimensions: 1080x1350 pixels.
Primary color: {background_color} (e.g., #f5f4ed)
Accent color: {accent_color} (e.g., #d97757)

Style: [HERO variant]
- Warm, textured paper-like surface in the primary color
- Subtle accent color warmth radiating from one corner (~8-12% opacity)
- Fine grain/noise texture for premium paper feel
- NO text, NO logos, NO objects — pure abstract background
- Slight vignette at edges (darker by 3-5%)
- The top 280px may have a slightly different tonal value (logo zone)
- Premium, editorial, refined — think luxury magazine page

[CONTENT variant]
- Same warm base but even more subtle
- Minimal accent color presence
- Consistent fine texture
- Clean canvas that lets serif typography shine
- Same top/bottom zone treatment
```

### Step 2: Generate via Gemini

Use Gemini's image generation through OpenRouter. Call the API with the prompt above.

**If Gemini image generation is not available via OpenRouter**, fall back to:

1. **Ask Claude to generate SVG backgrounds** — Claude can create rich SVG backgrounds with:
   - Multiple layered gradients (radial + linear)
   - SVG noise via `<feTurbulence>` with higher base frequency and stronger opacity
   - Subtle geometric patterns (dots, lines, mesh) using `<pattern>`
   - Vignette effect via radial gradient overlay
   - Paper texture simulation

   Generate the SVG, then save it. post-process.mjs already supports SVG backgrounds.

2. **Ask the user to provide their own** — "Upload a background image (PNG/JPG) to `./brand-assets/backgrounds/hero-bg.png`"

### Step 3: Save backgrounds

Save generated backgrounds to:
```
./brand-assets/backgrounds/
├── hero-bg.png (or .svg)
└── content-bg.png (or .svg)
```

### Step 4: Update brand-profile.json

Update the background paths:
```json
{
  "visual": {
    "background": {
      "style": "image",
      "color": "#f5f4ed",
      "heroImage": "./brand-assets/backgrounds/hero-bg.png",
      "contentImage": "./brand-assets/backgrounds/content-bg.png"
    }
  }
}
```

## SVG Background Fallback

If image generation isn't available, generate rich SVG backgrounds yourself. Here's what makes a good SVG background:

### Dark mode SVG background:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <radialGradient id="glow" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.12"/>
      <stop offset="60%" stop-color="{accent}" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="{bg_color}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="20%" stop-color="#000" stop-opacity="0"/>
      <stop offset="80%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="{bg_color}"/>
  <rect width="1080" height="1350" fill="url(#glow)"/>
  <rect width="1080" height="1350" filter="url(#noise)" opacity="0.08"/>
  <rect width="1080" height="1350" fill="url(#vignette)"/>
</svg>
```

### Light mode SVG background:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">
  <defs>
    <filter id="paper">
      <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="5" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <radialGradient id="warmth" cx="70%" cy="20%" r="70%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="{bg_color}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="{bg_color}" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.04"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="1350" fill="{bg_color}"/>
  <rect width="1080" height="1350" fill="url(#warmth)"/>
  <rect width="1080" height="1350" filter="url(#paper)" opacity="0.04"/>
  <rect width="1080" height="1350" fill="url(#vignette)"/>
</svg>
```

These use multiple layers: base color → accent glow → noise texture → vignette. Much richer than a single flat rect.

## After Generation

Tell the user:
- "Backgrounds generated and saved. All future carousels will use these."
- "Run `/carousel:generate` to see them in action."
- "Run `/carousel:backgrounds` again anytime to regenerate."
