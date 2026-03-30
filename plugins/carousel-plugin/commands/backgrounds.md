---
name: carousel:backgrounds
description: Generate premium branded background images for your carousel slides using Gemini image generation. Builds prompts dynamically from the decision tree output in brand-profile.json.
---

# Background Generator

Generate premium branded background images using Gemini's image generation. Prompts are built dynamically from the specific decision tree path the user took during `/carousel:setup` -- the style, sub-type, intensity, texture, and hero drama level all shape the final prompt.

## Pre-flight

1. Read `brand-profile.json` for the full profile. Key background fields:
   - `visual.background.style` -- `"textured"` | `"gradient"` | `"futuristic"` | `"minimal"` | `"upload"`
   - `visual.background.textureType` -- (textured only) `"vintage_parchment"` | `"clean_matte"` | `"linen"` | `"concrete"`
   - `visual.background.gradientType` -- (gradient only) `"noise"` | `"mesh"` | `"linear_sweep"` | `"radial_glow"`
   - `visual.background.futureType` -- (futuristic only) `"dark_chrome"` | `"neon_glow"` | `"holographic"` | `"grid"`
   - `visual.background.minimalType` -- (minimal only) `"solid"` | `"corner_accent"` | `"subtle_gradient"`
   - `visual.background.intensity` -- (gradient only) `"subtle"` | `"medium"` | `"strong"`
   - `visual.background.texture` -- (gradient only) `"grainy"` | `"smooth"`
   - `visual.background.heroDramatic` -- `"same"` | `"slightly"` | `"significantly"`
   - `visual.background.color` -- base/fallback color
   - `visual.colors.accent` -- accent color
   - `visual.designMode` -- `"dark"` | `"light"`
   - `visual.canvas` -- dimensions and safe zones
2. Check for Google API key: look for `GEMINI_API_KEY` or `DEFAULT_GEMINI_KEY` in environment or `backend/.env`
3. If no key found, ask the user for one

## Upload-Your-Own Flow

If `visual.background.style` is `"upload"`:
- The user already provided file paths during `/carousel:setup`
- Check that `visual.background.heroImage` and `visual.background.contentImage` paths exist
- If paths are set and files exist, confirm: "Your uploaded backgrounds are already configured. Run `/carousel:generate` to use them."
- If paths are missing, ask the user for hero and content background file paths (PNG/JPG)
- Copy files to `./brand-assets/backgrounds/hero-bg.png` and `content-bg.png`
- Update `brand-profile.json` with the paths
- Skip all Gemini generation -- done

## Solid Color Flow

If `visual.background.style` is `"minimal"` and `visual.background.minimalType` is `"solid"`:
- No Gemini generation needed
- Create a solid-color PNG at `canvas.width` x `canvas.height` using the base color
- Save as both `hero-bg.png` and `content-bg.png`
- Update `brand-profile.json` with paths
- Done

## Prompt Builder System

For all other style/sub-type combinations, build the Gemini prompt dynamically from the specific decision tree path.

### Base Prompt (always included)

```
Generate a premium abstract background image.
Dimensions: {canvas.width}x{canvas.height} pixels, portrait orientation.
Base color: {background.color}
Accent color: {colors.accent}
Design mode: {designMode}
```

### Style-Specific Prompt Blocks

Append the matching block based on `style` + sub-type. Each path produces a distinct, opinionated prompt.

#### TEXTURED paths (`style == "textured"`)

**vintage_parchment:**
```
Style: VINTAGE PARCHMENT
Aged warm paper with natural imperfections. Slightly yellowed, with subtle fiber texture.
Uneven tone variations suggesting real aged paper. Delicate, fragile, historical feel.
Like a 100-year-old letter or vintage book page. The accent color appears as very faint staining.
```

**clean_matte:**
```
Style: CLEAN MATTE PAPER
Modern uncoated card stock. Fine uniform grain. Premium stationery feel.
Think: Aesop packaging, luxury business card. Subtle but tactile.
The accent color as a nearly imperceptible warm shift in one area.
```

**linen:**
```
Style: LINEN / FABRIC TEXTURE
Fine woven texture visible at close inspection. Elegant, tactile, textile.
Like high-thread-count linen or premium canvas. Warm and organic.
Accent color as subtle tonal warmth.
```

**concrete:**
```
Style: CONCRETE / INDUSTRIAL
Raw concrete or plaster surface. Cool gray tones. Brutalist, minimal.
Visible texture: tiny pits, subtle variations, industrial materiality.
Accent color as a very faint warm wash in one area.
```

#### GRADIENT paths (`style == "gradient"`)

**noise:**
```
Style: NOISE GRADIENT
Smooth color transitions between base ({background.color}) and accent ({colors.accent}).
{IF texture == "grainy": "Fine visible grain/noise overlay across the entire surface."}
{IF texture == "smooth": "Smooth, no texture -- pure clean gradient."}
The colors should blend organically, not in sharp bands.
Think: modern design tools, Figma backgrounds, creative coding art.
```

**mesh:**
```
Style: MESH GRADIENT
Organic flowing color pools with soft edges. Multiple anchor points of color.
Blurred transitions. Think: Apple Music, iOS widgets, soft aurora.
{IF texture == "grainy": "Add fine grain texture overlay for tactile premium feel."}
{IF texture == "smooth": "Keep completely smooth -- no texture, pure color flow."}
```

**linear_sweep:**
```
Style: LINEAR SWEEP
Clean geometric color transition. Diagonal or horizontal.
Solid bands or smooth linear gradient. Architectural, precise.
Think: Stripe.com headers, Linear.app.
{IF texture == "grainy": "Overlay fine noise/grain for depth."}
{IF texture == "smooth": "Pure clean gradient, no texture."}
```

**radial_glow:**
```
Style: RADIAL GLOW
Accent color emanating from a single point (top-center or one corner).
Gradual fade into base color. Atmospheric, like stage lighting.
Think: Apple keynote stage, spotlight effect.
{IF texture == "grainy": "Add subtle grain overlay."}
{IF texture == "smooth": "Keep smooth and clean."}
```

For ALL gradient paths, also append the intensity block:

**subtle:**
```
ACCENT INTENSITY: SUBTLE
Accent covers max 10-15% of image area. Edges and corners only. The base color dominates.
```

**medium:**
```
ACCENT INTENSITY: MEDIUM
Accent covers 20-30%. Clear presence but not overwhelming.
```

**strong:**
```
ACCENT INTENSITY: STRONG
Accent covers 30-50%. Bold statement. Still leave readable areas for text.
```

#### FUTURISTIC paths (`style == "futuristic"`)

**dark_chrome:**
```
Style: DARK CHROME
Metallic, reflective dark surface. Subtle specular highlights.
Premium automotive finish. Brushed metal feel with depth.
Accent color as a very subtle reflection or edge highlight.
```

**neon_glow:**
```
Style: NEON GLOW
Deep dark base with accent color ({colors.accent}) as a bright neon glow.
The glow should feel like it's emitting light -- bleeding slightly into the dark.
Cyberpunk, terminal aesthetic. Sharp contrast between dark and bright.
```

**holographic:**
```
Style: HOLOGRAPHIC
Iridescent, prismatic color shifts. Rainbow-adjacent but controlled.
Think: holographic foil, oil-on-water effect. Premium and futuristic.
Subtle and premium, not garish.
```

**grid:**
```
Style: GRID / WIREFRAME
Subtle technical grid pattern on dark background. Thin lines.
Think: blueprint, technical drawing, code editor background.
The grid should be very subtle (5-8% opacity). Clean and technical.
```

#### MINIMAL paths (`style == "minimal"`)

**corner_accent:**
```
Style: MINIMAL WITH CORNER ACCENT
95% solid base color. One very subtle accent wash in one corner.
Almost invisible -- just enough to suggest depth and warmth.
Maximum restraint.
```

**subtle_gradient:**
```
Style: BARELY-THERE GRADIENT
Nearly flat base color with an imperceptible tonal shift.
Same color family -- just 3-5% lighter or warmer in the center.
If someone has to squint to see the gradient, it's right.
```

(Note: `solid` is handled by the Solid Color Flow above -- no Gemini call needed.)

### Hero vs Content Variant

Generate TWO backgrounds: one hero, one content.

#### Content slide prompt

Always append to the content slide prompt:
```
This is a CONTENT slide -- text readability is the #1 priority.
Reduce accent intensity by ~40% compared to the hero slide.
The center must be very clean. Accent color only at the far edges, very soft.
```

#### Hero slide prompt

Modify based on `heroDramatic`:

**same:**
No modification -- use the same prompt as content slides (without the content-slide reduction).

**slightly:**
Append:
```
This is the HERO slide. Increase accent intensity by ~50% compared to a content slide.
Slightly more visual drama and depth. Still professional and premium.
```

**significantly:**
Append:
```
This is the HERO slide. Make this dramatic and eye-catching.
Double the accent intensity. Strong visual impact -- this slide stops the scroll.
Bold color presence and depth. Still keep text areas readable.
```

### Layout Rules (always appended)

```
LAYOUT RULES:
- The CENTER of the image (middle 60%) must be cleaner than the edges
- Text content will be overlaid -- ensure readability
- Top 20% and bottom 20% can have slightly different treatment (header/footer zones)

ABSOLUTE RULES:
- NO text, NO logos, NO symbols, NO objects
- Pure abstract background only
- Professional quality
```

### Design Mode Block (always appended)

**dark:**
```
ATMOSPHERE: DARK MODE
Dark, moody atmosphere. Deep shadows. The accent color glows against darkness.
The base color is dark -- accent elements should feel like they emit light.
```

**light:**
```
ATMOSPHERE: LIGHT MODE
Warm, luminous atmosphere. The accent color creates soft pools of warmth on the light base.
Clean and airy. The accent should feel like sunlight or a gentle wash.
```

## API Call

Use the Google AI API directly (NOT OpenRouter -- it does not support image generation):

```python
import urllib.request, json, base64

API_KEY = "{gemini_api_key}"

body = json.dumps({
    "contents": [{"parts": [{"text": "{assembled_prompt}"}]}],
    "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
})

req = urllib.request.Request(
    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={API_KEY}",
    data=body.encode(),
    headers={"Content-Type": "application/json"}
)

resp = urllib.request.urlopen(req, timeout=120)
data = json.loads(resp.read())

# Extract image from response
for part in data["candidates"][0]["content"]["parts"]:
    if "inlineData" in part:
        img_bytes = base64.b64decode(part["inlineData"]["data"])
        with open("output.png", "wb") as f:
            f.write(img_bytes)
```

## Generation Flow

1. **Build hero prompt**: Base prompt + style-specific block + hero variant block + layout rules + design mode block
2. **Call Gemini** for hero background, save to `./brand-assets/backgrounds/hero-bg.png`
3. **Build content prompt**: Base prompt + style-specific block (with ~40% reduced intensity language) + content variant block + layout rules + design mode block
4. **Call Gemini** for content background, save to `./brand-assets/backgrounds/content-bg.png`
5. **Update `brand-profile.json`**:

```json
{
  "visual": {
    "background": {
      "heroImage": "./brand-assets/backgrounds/hero-bg.png",
      "contentImage": "./brand-assets/backgrounds/content-bg.png"
    }
  }
}
```

(Merge into existing background object -- do not overwrite style/type/intensity fields.)

6. **Show the user** the generated backgrounds (use Read tool to display the images)
7. Ask if they're happy or want to regenerate

## Regeneration with Feedback

If the user doesn't like the result, ask what they'd change. Common feedback and how to modify the prompt:

| User says | Prompt modification |
|-----------|-------------------|
| "more subtle" | Reduce intensity language (strong->medium, medium->subtle) |
| "more color" | Increase intensity language one level |
| "too busy" | Add "Reduce visual complexity by 50%. Fewer elements, more negative space." |
| "too dark" | Add "Lighten the base color by 15-20%. More luminosity overall." |
| "too flat" | Add "More depth and dimension. Subtle shadow layers and tonal variation." |
| "center isn't clean enough" | Reinforce: "The center 60% must be ALMOST SOLID base color. Push ALL visual elements to the outer 20% edges." |
| "try a different sub-type" | Switch to a different sub-type within the same style family and regenerate |
| Custom feedback | Append the user's exact words as an additional instruction block |

After modifying the prompt, regenerate and replace the files. The brand-profile.json values stay the same unless the user explicitly wants to change their preferences.

Tell the user: "Run `/carousel:backgrounds` again anytime to regenerate. Or provide your own PNGs at `./brand-assets/backgrounds/hero-bg.png` and `content-bg.png`."
