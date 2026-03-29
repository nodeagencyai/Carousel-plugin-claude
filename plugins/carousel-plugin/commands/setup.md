---
name: carousel:setup
description: Configure your brand identity for carousel generation. Interactive wizard that sets up colors, fonts, tone, and brand DNA.
---

# Carousel Brand Setup Wizard

## Pre-flight Check

Before starting, check if the user already has a `brand-profile.json` in their project root. If they do, ask if they want to update it or start fresh.

Check for OpenRouter API key:
1. Check environment variable: `OPENROUTER_API_KEY`
2. If not found, ask the user for their key and note they can get one at https://openrouter.ai
3. Save the key reference for generation use

## Website Auto-Detection (Optional First Step)

Ask: "Do you have a website I can scan to auto-detect your brand colors, fonts, and style?"

If yes:
- Use WebFetch to retrieve the URL
- Extract: dominant colors (from CSS, meta theme-color, prominent visual elements), font families (from CSS font-family declarations, Google Fonts links), overall tone/style
- Pre-fill the brand profile with detected values
- Present findings and ask the user to confirm or adjust

If no: proceed to manual setup.

## Stage 1: Visual Identity

Ask these questions ONE AT A TIME:

1. **Brand name** — "What's your brand name?"

2. **Colors** — "What are your brand colors?"
   - Ask for primary color (background/dark color) and accent color (highlight/pop color)
   - Accept hex codes, color names, or "from my website"
   - Also derive: text color (usually white on dark, or dark on light), caption color (muted version)
   - Generate a gradient from the accent color (lighter/darker variants)

3. **Background** — "How do you want your slide backgrounds?"
   Present three clear options:

   **Option A: Upload your own** — User provides a path to a PNG/JPG image file. Ask if they want separate backgrounds for the hero slide (slide 1) and content slides (slides 2+), or the same for all. Save the file path(s) in brand-profile.json.

   **Option B: Generate a gradient** — Create a gradient background SVG from their brand colors. Offer styles:
   - Linear dark-to-darker (e.g., primary color at 80% darkness → 95% darkness)
   - Radial glow (subtle accent color glow from center on dark base)
   - Diagonal sweep (accent color at low opacity sweeping corner to corner)

   Generate the SVG background file(s), save to `./brand-assets/backgrounds/hero-bg.svg` and `content-bg.svg`, and reference in brand-profile.json. Example gradient SVG:
   ```xml
   <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">
     <defs>
       <radialGradient id="glow" cx="50%" cy="40%" r="60%">
         <stop offset="0%" stop-color="{accent}" stop-opacity="0.15"/>
         <stop offset="100%" stop-color="{primary}" stop-opacity="0"/>
       </radialGradient>
     </defs>
     <rect width="1080" height="1350" fill="{primary_darkened}"/>
     <rect width="1080" height="1350" fill="url(#glow)"/>
   </svg>
   ```

   **Option C: AI-generate a branded background** — Call Gemini via OpenRouter to generate a custom textured/patterned background based on brand identity. Prompt Gemini to create a subtle, non-distracting SVG background with brand-appropriate textures (geometric patterns, noise, grain, mesh gradients). Save generated SVGs to `./brand-assets/backgrounds/`. Generate both hero and content variants.

   For all options, also ask: "Same background for all slides, or different for the opening slide vs. content slides?"

4. **Fonts** — "What fonts should we use?"
   - Primary font (headlines) — Google Font name or system font
   - Secondary font (body text) — Google Font name or system font
   - Suggest popular pairings if they're unsure: Space Grotesk + Inter, Montserrat + Open Sans, Poppins + Nunito

5. **Logo** (optional) — "Do you have a logo file (SVG or PNG) to include in the header area?"
   - If yes, note the file path
   - If no, skip — slides will use full header space

## Stage 2: Content Style

6. **Text density** — "How text-heavy should your carousels be?"
   - Minimal: Big bold statements, few words, maximum visual impact
   - Balanced: Mix of data points and narrative text (recommended)
   - Dense: Data-heavy, lots of information, infographic style

7. **Tone** — "What tone fits your brand?"
   - Educational: Informative, teaching-focused
   - Professional: Corporate, polished
   - Casual: Friendly, conversational
   - Bold: Provocative, attention-grabbing

8. **Visual frameworks** — "Any preferred visual styles for your slides?"
   - Show the options: data tables, bar charts, quadrant matrices, stacked layers, flow diagrams, or "auto" (let AI decide)
   - Default to "auto" if unsure

## Stage 3: Brand DNA

9. **Brand description** — "What does your brand do? (one sentence)"

10. **Target audience** — "Who is your target audience?"

11. **Voice guidelines** (optional) — "Any specific brand voice rules? (e.g., 'never use exclamation marks', 'always back claims with data')"

12. **Industry** — "What industry/niche are you in?"

## Output

After collecting all answers, generate the `brand-profile.json` file in the project root:

```json
{
  "name": "Brand Name",
  "visual": {
    "colors": {
      "primary": "#1a1a1a",
      "accent": "#FF6B35",
      "text": "#FFFFFF",
      "caption": "#999999",
      "gradient": { "from": "#FF6B35", "to": "#FFB347" }
    },
    "fonts": {
      "primary": "Space Grotesk",
      "secondary": "Inter"
    },
    "background": {
      "style": "gradient",
      "color": "#1a1a1a",
      "gradientStyle": "radial_glow",
      "heroImage": "./brand-assets/backgrounds/hero-bg.svg",
      "contentImage": "./brand-assets/backgrounds/content-bg.svg"
    },
    "logo": null,
    "canvas": { "width": 1080, "height": 1350 }
  },
  "content": {
    "density": "balanced",
    "tone": "educational",
    "frameworks": "auto",
    "slideCount": { "default": 5, "range": [3, 10] }
  },
  "brand": {
    "description": "...",
    "audience": "...",
    "voice": [],
    "industry": "..."
  }
}
```

Confirm the profile looks good, then tell the user they're ready to generate carousels with `/carousel:generate`.
