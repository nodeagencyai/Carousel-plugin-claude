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

## Style Preset (Start Here)

Ask: "Pick a starting style — you can customize everything after."

Present the 5 options:
1. **Minimalist** — Light, airy, thin fonts, muted tones. Think Apple.
2. **Bold** — Dark, high-contrast, vibrant accent, punchy. Think Nike.
3. **Editorial** — Dark, serif headlines, sophisticated. Think Vogue.
4. **Corporate** — Light, clean, structured, professional. Think McKinsey.
5. **Neon/Tech** — Dark, monospace, bright neon accent. Think GitHub.
6. **Custom** — Start from scratch

If the user picks a preset (1-5):
- Load the matching preset from `prompts/style-presets.md`
- Pre-fill the brand-profile.json with those values
- Tell the user: "I've loaded the {preset} style. Now let's customize it for your brand."
- Skip to brand name question, then let them override any values they want
- Values they don't change keep the preset defaults

If Custom: proceed with the existing manual flow.

## Website Auto-Detection (Optional First Step)

Ask: "Do you have a website I can scan to auto-detect your brand colors, fonts, and style?"

If yes:
- Use WebFetch to retrieve the URL
- Extract: dominant colors (from CSS, meta theme-color, prominent visual elements), font families (from CSS font-family declarations, Google Fonts links), overall tone/style
- Pre-fill the brand profile with detected values
- Present findings and ask the user to confirm or adjust

If no: proceed to the next step.

## Reference Carousel Analysis (Optional)

Ask: "Do you have any existing carousels you'd like me to analyze for style? Upload images or provide file paths and I'll extract your visual patterns."

If yes:
- User provides paths to carousel images (PNG/JPG/SVG)
- Read/view each image file using the Read tool (which supports viewing images)
- Extract and analyze: color palette, typography style (serif/sans-serif, weight, size patterns), layout patterns (centered, left-aligned, grid-based), text density level, overall tone and mood
- Use these observations to pre-fill the brand profile values before Stage 1
- Present findings to the user: "Based on your existing carousels, I see: [e.g., dark backgrounds, bold sans-serif headlines, minimal text density, data-heavy frameworks, accent color highlights on key metrics...]"
- User confirms or adjusts the detected patterns
- Carry these values forward into the Stage 1 questions (pre-filling answers where the analysis provides clear signals)

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

4. **Platform / Aspect ratio** — "What platform are you primarily designing for?"
   - Instagram Carousel (1080x1350) — default
   - Instagram Square (1080x1080)
   - LinkedIn Post (1200x627)
   - Stories (1080x1920)
   - Presentation (1920x1080)

   This sets canvas dimensions and safe zones proportionally:
   - Instagram Carousel: 1080x1350, safe y:300-1100, safe x:140-920
   - Instagram Square: 1080x1080, safe y:200-880, safe x:140-920
   - LinkedIn Post: 1200x627, safe y:80-527, safe x:100-1100
   - Stories: 1080x1920, safe y:200-1720, safe x:100-980
   - Presentation: 1920x1080, safe y:100-930, safe x:150-1770

5. **Fonts** — "What fonts should we use?"
   - Primary font (headlines) — Google Font name or system font
   - Secondary font (body text) — Google Font name or system font
   - Suggest popular pairings if they're unsure: Space Grotesk + Inter, Montserrat + Open Sans, Poppins + Nunito

   Then ask: "Optional: Do you have a display/headline font for extra impact on hero slides?"
   - If yes: save as `visual.fonts.display` in brand-profile.json
   - If no: hero slides use the primary font (default — `visual.fonts.display` stays `null`)

6. **Logo** (optional) — "Do you have a logo file (SVG or PNG) to include in the header area?"
   - If yes, note the file path
   - If no, skip — slides will use full header space

7. **Design mode** — "Do you prefer dark or light slides?"
   - **Dark mode** (default, recommended): Dark backgrounds with light text. Best for social media feeds.
     - Defaults: text=#FFFFFF, caption=#999999, primary=#1a1a1a
   - **Light mode**: Light backgrounds with dark text. Clean, minimal feel.
     - Defaults: text=#1a1a1a, caption=#666666, primary=#FFFFFF
   - Store the choice in `visual.designMode` ("dark" or "light")
   - Pre-fill color defaults based on the selection (user can still override in the Colors question)

## Stage 2: Content Style

8. **Text density** — "How text-heavy should your carousels be?"
   - Minimal: Big bold statements, few words, maximum visual impact
   - Balanced: Mix of data points and narrative text (recommended)
   - Dense: Data-heavy, lots of information, infographic style

9. **Tone** — "What tone fits your brand?"
   - Educational: Informative, teaching-focused
   - Professional: Corporate, polished
   - Casual: Friendly, conversational
   - Bold: Provocative, attention-grabbing

10. **Visual frameworks** — "Any preferred visual styles for your slides?"
   - Show the options: data tables, bar charts, quadrant matrices, stacked layers, flow diagrams, or "auto" (let AI decide)
   - Default to "auto" if unsure

## Stage 3: Brand DNA

11. **Brand description** — "What does your brand do? (one sentence)"

12. **Target audience** — "Who is your target audience?"

13. **Voice guidelines** (optional) — "Any specific brand voice rules? (e.g., 'never use exclamation marks', 'always back claims with data')"

14. **Industry** — "What industry/niche are you in?"

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
    "fonts": { "primary": "Inter", "secondary": "Inter", "display": null },
    "background": {
      "style": "solid_dark",
      "color": "#1a1a1a",
      "heroImage": null,
      "contentImage": null
    },
    "canvas": {
      "width": 1080, "height": 1350,
      "headerHeight": 280, "contentStart": 300,
      "footerStart": 1100,
      "safeXMin": 140, "safeXMax": 920
    },
    "designMode": "dark"
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

When writing background choices:
- **Option A (Upload)**: Set `visual.background.style` to `"image"`, store paths in `visual.background.heroImage` and/or `visual.background.contentImage`
- **Option B (Gradient)**: Set `visual.background.style` to `"gradient"`, generate SVG files and store paths in `visual.background.heroImage` / `visual.background.contentImage`
- **Option C (AI-generated)**: Set `visual.background.style` to `"ai_generated"`, generate SVG files and store paths in `visual.background.heroImage` / `visual.background.contentImage`
- For all options, `visual.background.color` is the solid fallback color

Confirm the profile looks good, then tell the user they're ready to generate carousels with `/carousel:generate`.
