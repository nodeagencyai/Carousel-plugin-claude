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

3. **Platform / Aspect ratio** — "What platform are you primarily designing for?"
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

4. **Fonts** — "What fonts should we use?"
   - Primary font (headlines) — Google Font name or system font
   - Secondary font (body text) — Google Font name or system font
   - Suggest popular pairings if they're unsure: Space Grotesk + Inter, Montserrat + Open Sans, Poppins + Nunito

   Then ask: "Optional: Do you have a display/headline font for extra impact on hero slides?"
   - If yes: save as `visual.fonts.display` in brand-profile.json
   - If no: hero slides use the primary font (default — `visual.fonts.display` stays `null`)

5. **Logo** (optional) — "Do you have a logo file (SVG or PNG) to include in the header area?"
   - If yes, note the file path
   - If no, skip — slides will use full header space

6. **Design mode** — "Do you prefer dark or light slides?"
   - **Dark mode** (default, recommended): Dark backgrounds with light text. Best for social media feeds.
     - Defaults: text=#FFFFFF, caption=#999999, primary=#1a1a1a
   - **Light mode**: Light backgrounds with dark text. Clean, minimal feel.
     - Defaults: text=#1a1a1a, caption=#666666, primary=#FFFFFF
   - Store the choice in `visual.designMode` ("dark" or "light")
   - Pre-fill color defaults based on the selection (user can still override in the Colors question)

## Background Preferences (Decision Tree)

Guide the user through a branching conversation to discover their ideal background. Ask one question at a time, and follow the branch they choose.

### Branch 1: "What's the overall vibe for your backgrounds?"

Present these options naturally:

a) **Textured / Paper** -- tactile, physical, editorial feel. Go to Branch 2A.
b) **Gradient** -- smooth color transitions, modern design tool aesthetic. Go to Branch 2B.
c) **Futuristic / Tech** -- dark chrome, neon, holographic. Go to Branch 2C.
d) **Clean / Minimal** -- solid or near-solid, maximum restraint. Go to Branch 2D.
e) **Upload my own** -- ask for hero and content background file paths (PNG/JPG), save paths to brand profile, done.

### Branch 2A: Textured / Paper

Ask: "What kind of paper feel?"

a) **Vintage parchment** -- aged, warm, slightly distressed. Like a 100-year-old letter.
b) **Clean matte** -- modern uncoated card stock, subtle grain. Think Aesop packaging.
c) **Linen / fabric** -- fine woven texture, elegant and tactile.
d) **Concrete / industrial** -- raw, cool, brutalist. Visible pits and subtle variations.

Save: `style="textured"`, `textureType="{choice}"` (one of: `vintage_parchment`, `clean_matte`, `linen`, `concrete`)

Then skip to the Final Question.

### Branch 2B: Gradient

Ask: "What style of gradient?"

a) **Noise gradient** -- smooth color transitions with fine grain overlay. Think Figma, creative coding.
b) **Mesh gradient** -- organic flowing color pools, blurred. Think Apple Music, iOS widgets.
c) **Linear sweep** -- clean diagonal or horizontal color bands. Think Stripe.com, Linear.app.
d) **Radial glow** -- color emanating from a single point. Think Apple keynote stage lighting.

Then ask: "How much accent color?"

a) **Subtle** -- accent barely visible, 10-15% of area. Edges only.
b) **Medium** -- clear presence, 20-30% of area.
c) **Strong** -- bold statement, 30-50% of area.

Then ask: "Grainy or smooth?"

a) **Grainy** -- visible noise texture across the surface.
b) **Smooth** -- no texture, pure clean gradient.

Save: `style="gradient"`, `gradientType="{choice}"` (one of: `noise`, `mesh`, `linear_sweep`, `radial_glow`), `intensity="{choice}"` (one of: `subtle`, `medium`, `strong`), `texture="{choice}"` (one of: `grainy`, `smooth`)

Then skip to the Final Question.

### Branch 2C: Futuristic / Tech

Ask: "What feel?"

a) **Dark chrome** -- metallic, reflective, premium dark. Brushed metal with depth.
b) **Neon glow** -- bright accent on deep dark, cyberpunk. The glow bleeds into darkness.
c) **Holographic** -- iridescent, prismatic shifts. Like holographic foil.
d) **Grid / wireframe** -- subtle technical grid pattern. Blueprint, code editor feel.

Save: `style="futuristic"`, `futureType="{choice}"` (one of: `dark_chrome`, `neon_glow`, `holographic`, `grid`)

Then skip to the Final Question.

### Branch 2D: Clean / Minimal

Ask: "How minimal?"

a) **Solid color** -- pure flat, no gradient at all. No Gemini generation needed.
b) **Solid + subtle corner accent** -- 95% flat, tiny warmth in one corner. Maximum restraint.
c) **Very subtle gradient** -- barely perceptible tonal shift, same color family.

Save: `style="minimal"`, `minimalType="{choice}"` (one of: `solid`, `corner_accent`, `subtle_gradient`)

Then skip to the Final Question.

### Final Question (ALL paths):

Ask: "Hero slide (slide 1) -- same background as content slides, or more dramatic?"

a) **Same as content slides** -- consistent across all slides.
b) **Slightly more dramatic** (recommended) -- hero gets ~50% more accent intensity.
c) **Significantly more dramatic** -- hero gets double accent intensity and extra visual punch.

Save: `heroDramatic="{choice}"` (one of: `same`, `slightly`, `significantly`)

### What to save in brand-profile.json:

The background section should look like this (example for a noise gradient):

```json
{
  "visual": {
    "background": {
      "style": "gradient",
      "gradientType": "noise",
      "intensity": "medium",
      "texture": "grainy",
      "heroDramatic": "slightly",
      "color": "#0A0A0A",
      "heroImage": null,
      "contentImage": null
    }
  }
}
```

Notes on the saved fields:
- `style` is always set: `"textured"`, `"gradient"`, `"futuristic"`, `"minimal"`, or `"upload"`
- Sub-type fields (`textureType`, `gradientType`, `futureType`, `minimalType`) are only present for their respective style
- `intensity` and `texture` are only present for the `"gradient"` style
- `heroDramatic` is always present: `"same"`, `"slightly"`, or `"significantly"`
- `color` is the base/fallback color (from the Colors question)
- `heroImage` and `contentImage` are `null` until `/carousel:backgrounds` generates them (or user uploads)

## Branding Frame

Configure the persistent branded elements that appear on every slide.

12. **Logo placement** — "Where should your logo appear?"
    - Top-left (default)
    - Top-center
    - Top-right
    - No logo — use brand name text instead

13. **Logo on every slide?** — "Show logo on all slides or hero only?"
    - Every slide (default)
    - Hero slide only

14. **Footer text** — "What text should appear in the footer?"
    - Website URL (e.g., "anthropic.com")
    - Social handle (e.g., "@anthropic")
    - Tagline
    - None

15. **Footer text placement** — "Where should footer text go?"
    - Bottom-right (default)
    - Bottom-left

16. **Slide counter** — "Show slide numbers (1/5, 2/5)?"
    - Yes (default)
    - No

17. **Slide counter placement** — opposite side of footer text
    - If footer is bottom-right → counter bottom-left (default)
    - If footer is bottom-left → counter bottom-right

18. **Hero CTA** — "Call-to-action on first slide?"
    - "Swipe for more →" (default)
    - Custom text
    - None

19. **Divider line** — "Divider line above the footer?"
    - Thin accent line (default — 0.5px in accent color)
    - Thick accent (2px)
    - None

## Stage 2: Content Style

20. **Text density** — "How text-heavy should your carousels be?"
    - Minimal: Big bold statements, few words, maximum visual impact
    - Balanced: Mix of data points and narrative text (recommended)
    - Dense: Data-heavy, lots of information, infographic style

21. **Tone** — "What tone fits your brand?"
    - Educational: Informative, teaching-focused
    - Professional: Corporate, polished
    - Casual: Friendly, conversational
    - Bold: Provocative, attention-grabbing

22. **Visual frameworks** — "Any preferred visual styles for your slides?"
    - Show the options: data tables, bar charts, quadrant matrices, stacked layers, flow diagrams, or "auto" (let AI decide)
    - Default to "auto" if unsure

## Stage 3: Brand DNA

23. **Brand description** — "What does your brand do? (one sentence)"

24. **Target audience** — "Who is your target audience?"

25. **Voice guidelines** (optional) — "Any specific brand voice rules? (e.g., 'never use exclamation marks', 'always back claims with data')"

26. **Industry** — "What industry/niche are you in?"

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
      "style": "gradient",
      "gradientType": "noise",
      "intensity": "medium",
      "texture": "grainy",
      "heroDramatic": "slightly",
      "color": "#0A0A0A",
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
    "industry": "...",
    "frame": {
      "logo": {
        "path": null,
        "placement": "top-left",
        "maxHeight": 60,
        "showOn": "all"
      },
      "footer": {
        "text": "anthropic.com",
        "textPlacement": "bottom-right",
        "slideCounter": true,
        "counterPlacement": "bottom-left",
        "heroCta": "Swipe for more →",
        "dividerStyle": "thin"
      }
    }
  }
}
```

When writing background choices:
- **Upload my own**: Set `visual.background.style` to `"upload"`, store paths in `visual.background.heroImage` and/or `visual.background.contentImage`
- **All other styles**: Set `visual.background.style` to the chosen style (`"textured"`, `"gradient"`, `"futuristic"`, `"minimal"`), leave `heroImage` and `contentImage` as `null` until `/carousel:backgrounds` generates them
- Sub-type fields are style-specific: `textureType` for textured, `gradientType` for gradient, `futureType` for futuristic, `minimalType` for minimal
- `intensity` and `texture` fields are only used with the `"gradient"` style
- `heroDramatic` is always set: `"same"`, `"slightly"`, or `"significantly"`
- `visual.background.color` is always the solid fallback color

Note: The old `brand.footer` and `brand.logo` fields have been migrated to `brand.frame.footer` and `brand.frame.logo`. The `brand.frame.logo` now includes `showOn` ("all" or "hero") and the `brand.frame.footer` now includes `textPlacement`, `counterPlacement`, and `dividerStyle`.

Confirm the profile looks good, then tell the user they're ready to generate carousels with `/carousel:generate`. If they chose a generated background style (not "upload"), remind them to run `/carousel:backgrounds` to generate their background images.
