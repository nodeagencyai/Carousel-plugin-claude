---
name: setup
description: Configure your brand identity for carousel generation. Interactive wizard that sets up colors, fonts, tone, and brand DNA. Run this before generating your first carousel.
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

3. **Background style** — "What background style do you want for your slides?"
   - Solid dark color (most professional, recommended)
   - Gradient background
   - Custom image (user provides path to PNG/JPG)

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
      "style": "solid",
      "color": "#1a1a1a",
      "heroImage": null,
      "contentImage": null
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
