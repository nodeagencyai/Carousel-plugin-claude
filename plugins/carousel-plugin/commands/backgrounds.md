---
name: carousel:backgrounds
description: Generate premium branded background images for your carousel slides using Gemini image generation. Builds prompts dynamically from your brand-profile.json background preferences.
---

# Background Generator

Generate premium branded background images using Gemini's image generation. Prompts are built dynamically from the background preferences in `brand-profile.json` — style, intensity, hero drama level, and center cleanliness all shape the final prompt.

## Pre-flight

1. Read `brand-profile.json` for the full profile. Key fields:
   - `visual.background.style` — `"geometric"` | `"mesh"` | `"textured"` | `"minimal"` | `"upload"`
   - `visual.background.intensity` — `"subtle"` | `"moderate"` | `"bold"`
   - `visual.background.heroDramatic` — `"minimal"` | `"moderate"` | `"bold"`
   - `visual.background.contentVariant` — `"same"` | `"subtler"` | `"plain"`
   - `visual.background.centerClean` — `true` | `false`
   - `visual.background.color` — base/fallback color
   - `visual.colors.accent` — accent color
   - `visual.designMode` — `"dark"` | `"light"`
   - `visual.canvas` — dimensions and safe zones
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
- Skip all Gemini generation — done

## Prompt Builder System

For generated styles (`"geometric"`, `"mesh"`, `"textured"`, `"minimal"`), build the Gemini prompt dynamically from brand profile values.

### Base Prompt Template

Every prompt starts with this structure. All `{values}` come from brand-profile.json:

```
Generate a premium abstract background for a social media carousel {slide_type} slide.

DIMENSIONS: {canvas.width}x{canvas.height} pixels (portrait orientation)

COLOR PALETTE:
- Base color: {background.color} (this should dominate the image)
- Accent color: {colors.accent}
- Design mode: {designMode}

{style_block}

{intensity_block}

{center_block}

{drama_block}

{design_mode_block}

ABSOLUTE RULES:
- NO text of any kind
- NO logos or symbols
- NO objects or recognizable shapes
- Pure abstract background art only
- Professional quality, not AI-slop
- Must work as a background with text overlaid on top
```

### Style Blocks

Insert the matching block based on `visual.background.style`:

**geometric:**
```
STYLE: GEOMETRIC
Clean diagonal bands, parallel lines, solid edges. Architectural precision. NOT blurry.
Think Stripe.com hero. Sharp angles, clean intersections, mathematical feel.
Use the accent color for select geometric elements against the base color.
Bands and lines should feel intentional and structured, not random.
```

**mesh:**
```
STYLE: MESH GRADIENT
Smooth flowing gradient pools with large blur radius. Organic transitions.
Think Apple Music. Soft color pools that blend seamlessly into each other.
The accent color creates warm/cool pools against the base color.
No hard edges — everything should feel like watercolor or aurora borealis.
Subtle grain texture across the surface for premium tactile feel.
```

**textured:**
```
STYLE: TEXTURED
Fine noise/grain, paper-like surface, tactile. Think luxury stationery or editorial magazine.
The surface should feel physical — like premium card stock or handmade paper.
Accent color appears as very subtle tonal shifts, not distinct shapes.
Grain should be fine and uniform, not chunky or digital-looking.
```

**minimal:**
```
STYLE: MINIMAL
Almost entirely base color. One very subtle accent wash in one corner.
Think corporate clean. The background should almost disappear behind content.
Maximum restraint — if in doubt, make it more subtle.
Accent color at most a gentle wash, never a distinct shape or gradient.
```

### Intensity Blocks

Insert based on `visual.background.intensity`:

**subtle:**
```
ACCENT INTENSITY: SUBTLE
Accent color covers max 10-15% of the image area. At edges and corners only.
The base color should dominate 85-90% of the visible area.
Accent presence should be barely noticeable — a whisper, not a statement.
```

**moderate:**
```
ACCENT INTENSITY: MODERATE
Accent color covers 20-30% of the image area. Visible but balanced with base.
Clear brand presence without overwhelming the content areas.
The accent should feel intentional but not dominant.
```

**bold:**
```
ACCENT INTENSITY: BOLD
Accent color covers 30-50% of the image area. Strong brand presence.
The accent should make a statement while still leaving readable areas.
Bold does not mean chaotic — keep it structured and premium.
```

### Center Clean Block

Insert based on `visual.background.centerClean`:

**true (recommended):**
```
CENTER ZONE: CLEAN
The CENTER of the image (roughly middle 60%) must be CLEANER and more subtle.
This is where text content will be placed — readability is critical.
Push all color action, gradients, and visual interest to the EDGES and CORNERS.
Think of the background as a frame — color wraps the edges, the center breathes.
Safe zone for content: x:{canvas.safeXMin}-{canvas.safeXMax}, y:{canvas.contentStart}-{canvas.footerStart}
```

**false:**
```
CENTER ZONE: OPEN
The gradient and visual elements can flow through the center of the image.
Still ensure enough contrast for text readability, but the composition is free-form.
Content will be overlaid with text shadows or backing shapes if needed.
```

### Drama Block (Hero vs Content)

For the **hero slide**, insert based on `visual.background.heroDramatic`:

**minimal:**
```
DRAMA LEVEL: MINIMAL
This is the hero/opening slide but keep it restrained.
Subtle accent presence — almost like a content slide with slightly more warmth.
```

**moderate:**
```
DRAMA LEVEL: MODERATE
This is the hero/opening slide — more visual impact than content slides.
Visible gradient or pattern presence, but still clean and professional.
Top 20% can have accent color presence (logo area). Bottom 20% can have subtle warmth (footer area).
```

**bold:**
```
DRAMA LEVEL: BOLD
This is the hero/opening slide — make it dramatic and eye-catching.
Strong accent color presence. This slide should stop the scroll.
Still keep content areas readable, but the overall impression should be bold and premium.
```

For the **content slide**, adapt based on `visual.background.contentVariant`:

**same:**
```
This is a content slide. Use the SAME visual treatment as the hero slide.
Maintain consistent intensity and style across all slides.
```

**subtler:**
```
This is a CONTENT slide — text, data, and visuals need to be clearly readable.
Much subtler than the hero slide. Reduce accent presence by ~50%.
The center must be very clean. Accent color only at the far edges, very soft.
Think: premium stationery, not a poster.
```

**plain:**
```
This is a CONTENT slide with PLAIN background.
Use almost entirely the base color. Minimal to no accent color.
A solid, clean canvas for maximum content readability.
At most, a barely-perceptible tonal variation to avoid feeling flat.
```

### Design Mode Block

Insert based on `visual.designMode`:

**dark:**
```
ATMOSPHERE: DARK MODE
Dark, moody atmosphere. Deep shadows. The accent color glows against darkness.
The base color is dark — accent elements should feel like they emit light.
```

**light:**
```
ATMOSPHERE: LIGHT MODE
Warm, luminous atmosphere. The accent color creates soft pools of warmth on the light base.
Clean and airy. The accent should feel like sunlight or a gentle wash.
```

## API Call

Use the Google AI API directly (NOT OpenRouter — it does not support image generation):

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

1. **Build hero prompt**: Assemble the base template with style block + intensity block + center block + hero drama block + design mode block
2. **Call Gemini** for hero background, save to `./brand-assets/backgrounds/hero-bg.png`
3. **Build content prompt**: Same base template but swap the drama block for the content variant block
4. **Call Gemini** for content background, save to `./brand-assets/backgrounds/content-bg.png`
5. **Update `brand-profile.json`**:

```json
{
  "visual": {
    "background": {
      "style": "{original style}",
      "intensity": "{original intensity}",
      "heroDramatic": "{original heroDramatic}",
      "contentVariant": "{original contentVariant}",
      "centerClean": true,
      "color": "{original color}",
      "heroImage": "./brand-assets/backgrounds/hero-bg.png",
      "contentImage": "./brand-assets/backgrounds/content-bg.png"
    }
  }
}
```

6. **Show the user** the generated backgrounds (use Read tool to display the images)
7. Ask if they're happy or want to regenerate

## Regeneration with Feedback

If the user doesn't like the result, ask what they'd change. Common feedback and how to modify the prompt:

| User says | Prompt modification |
|-----------|-------------------|
| "more subtle" | Reduce intensity one level (bold→moderate, moderate→subtle) |
| "less geometric" | Switch style block to mesh or minimal |
| "more color" | Increase intensity one level |
| "too busy" | Add "Reduce visual complexity by 50%. Fewer elements, more negative space." |
| "too dark" | Add "Lighten the base color by 15-20%. More luminosity overall." |
| "too flat" | Add "More depth and dimension. Subtle shadow layers and tonal variation." |
| "center isn't clean enough" | Reinforce: "The center 60% must be ALMOST SOLID base color. Push ALL visual elements to the outer 20% edges." |
| Custom feedback | Append the user's exact words as an additional instruction block |

After modifying the prompt, regenerate and replace the files. The brand-profile.json values stay the same unless the user explicitly wants to change their preferences.

Tell the user: "Run `/carousel:backgrounds` again anytime to regenerate. Or provide your own PNGs at `./brand-assets/backgrounds/hero-bg.png` and `content-bg.png`."
