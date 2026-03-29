# Carousel Generator Plugin

## Design Mode — READ THIS FIRST

Read `visual.designMode` from `brand-profile.json`. Default: **dark**.

The design mode controls the entire color scheme:

- **Dark mode**: Dark background with light text. Background color defaults to `#1a1a1a`. Text defaults to `#FFFFFF`.
- **Light mode**: Light background with dark text. Configure via brand profile.

If the output doesn't match the configured design mode (e.g., light backgrounds when mode is dark), something has gone wrong. Fix it immediately.

**Hard rules (always apply regardless of mode):**
- Background color: from `visual.background.color` (default `#1a1a1a`)
- Text color: from `visual.colors.text` (default `#FFFFFF`)
- Accent colors: from `visual.colors.accent` — muted, professional tones preferred
- The signature look is the **brand gradient** on key elements — premium, not garish

---

## Pipeline Overview

The plugin generates carousels in 4 steps:

| Step | Who | Cost |
|------|-----|------|
| 1. Content Strategy | Claude (YOU) | Free |
| 2. SVG Visual Generation | Gemini via OpenRouter | Paid |
| 3. Post-Processing | post-process.mjs | Free |
| 4. Visual Validation | Claude (YOU) | Free |

Pipeline: Claude (strategy, free) → Gemini (SVG, paid) → post-process.mjs (validation, free) → Claude (visual check, free)

### Step 1: Content Strategy (YOU generate this)

You produce a `strategy.json` with slide briefs: headlines, frameworks, data points, layout strategies.

- Follow the system prompt in `prompts/strategy-system.md`
- YOU are the strategist — no external API call needed
- Output must be valid JSON with a `slides` array

### Step 2: SVG Visual Generation (Gemini via OpenRouter — the ONLY paid call)

For each slide, call OpenRouter with model `google/gemini-2.5-flash` (configurable) to generate SVG content elements.

**Building the Gemini prompt — you MUST do all of these:**

1. Load the FULL system prompt from `prompts/visual-system.md`
2. Fill every `{{PLACEHOLDER}}` with actual values from:
   - The strategy slide brief (headline, framework, data_points, layout_strategy, etc.)
   - The brand profile (`brand-profile.json` in user's project root)
3. Load the matching framework section from `prompts/frameworks.md` and inject it as `{{FRAMEWORK_INSTRUCTIONS}}`
4. Ensure these brand values are filled correctly:
   - `{{FONT_PRIMARY}}` / `{{FONT_SECONDARY}}` from `visual.fonts`
   - `{{COLOR_TEXT}}` from `visual.colors.text`
   - `{{COLOR_ACCENT}}` from `visual.colors.accent`
   - `{{COLOR_CAPTION}}` from `visual.colors.caption`
   - `{{BACKGROUND_COLOR}}` from `visual.background.color`
   - `{{DESIGN_MODE}}` from `visual.designMode` (default: dark)

**The visual-system.md prompt contains design mode instructions and anti-patterns. Do NOT strip or summarize them. Send the full prompt to Gemini.**

### Step 3: Post-Processing (script handles wrapping, gradients, background)

Run the post-processing script for each slide:

```bash
node {plugin_root}/scripts/post-process.mjs \
  --input raw-slide-N.svg \
  --output slide-N.svg \
  --brand brand-profile.json \
  --slide-number N \
  --total-slides T
```

The script outputs JSON to stdout: `{ success: true, output: "...", slideNumber: N }` or `{ success: false, error: "..." }`.

**What post-process.mjs does:**
- Strips any `<svg>`, `<defs>`, `<style>` wrappers Gemini may have added
- Removes black background rectangles (Gemini often adds these despite instructions)
- Fixes safe-zone violations (clamps coordinates to bounds)
- Wraps content in a proper SVG envelope with:
  - Background rect (from brand profile's `visual.background.color`, defaults to `#1a1a1a`)
  - Font CSS with brand typography
  - The brand gradient definitions (`brandGradient`)

### Step 4: Validation and Fixing (YOU do this)

After post-processing, read each final SVG and verify:
- No content outside safe zone (y:300-1100, x:140-920)
- Background and text colors match the configured design mode
- Gradient references (`url(#brandGradient)`) are used correctly
- Text is legible (correct contrast for design mode, correct font sizes)
- No ALL CAPS text anywhere

If issues are found, edit the SVG directly to fix them.

---

## The Brand Gradient

The signature visual element is a 7-stop linear gradient that creates a brushed-metal/chrome effect. Post-process.mjs builds this from the brand profile's `visual.colors.gradient.from` and `visual.colors.gradient.to` values, interpolating intermediate stops automatically.

The gradient ID defined and available in the final SVG:
- `url(#brandGradient)` — primary brand gradient

**Gemini's SVG should reference this gradient ID on accent elements.** Gemini must NOT define its own `<linearGradient>` or `<radialGradient>` — post-process.mjs provides them.

**Usage rules:**
- Apply gradient to maximum 1-2 elements per slide
- Most text stays the primary text color
- Use gradient on the single most important data point or keyword
- For hero slides: one keyword in the headline gets `<tspan fill="url(#brandGradient)">keyword</tspan>`

---

## Canvas and Safe Zones

| Zone | Y Range | Purpose |
|------|---------|---------|
| Logo/Header | 0-280 | Reserved for logo — NO content here |
| Content safe zone | 300-1100 | ALL content must be placed here |
| Footer | 1100-1350 | Reserved — NO content here |

- Canvas: 1080 x 1350px (portrait, Instagram/LinkedIn optimized)
- Horizontal safe area: x=140 to x=920
- Canvas center: x=530

---

## Brand Profile Schema Reference

Brand identity is loaded from `brand-profile.json` in the user's project root. Key paths:

| Value | JSON Path | Fallback |
|-------|-----------|----------|
| Design mode | `visual.designMode` | `dark` |
| Background color | `visual.background.color` | `#1a1a1a` |
| Text color | `visual.colors.text` | `#FFFFFF` |
| Accent color | `visual.colors.accent` | — |
| Caption color | `visual.colors.caption` | `#999999` |
| Gradient from | `visual.colors.gradient.from` | accent color |
| Gradient to | `visual.colors.gradient.to` | `#FFFFFF` |
| Primary font | `visual.fonts.primary` | `Inter` |
| Secondary font | `visual.fonts.secondary` | `Inter` |
| Canvas width | `visual.canvas.width` | `1080` |
| Canvas height | `visual.canvas.height` | `1350` |
| Content start Y | `visual.canvas.contentStart` | `300` |
| Footer start Y | `visual.canvas.footerStart` | `1100` |
| Safe X min | `visual.canvas.safeXMin` | `140` |
| Safe X max | `visual.canvas.safeXMax` | `920` |
| Preferred frameworks | `content.frameworks` | `auto` |
| Excluded frameworks | `content.excludedFrameworks` | `[]` |

---

## API Configuration

- All API calls go to: `https://openrouter.ai/api/v1/chat/completions`
- API key: check `OPENROUTER_API_KEY` env var first, then fall back to plugin settings
- Strategy: YOU (Claude) — no API call needed
- SVG generation model: `google/gemini-2.5-flash` (configurable)

---

## Output Structure

```
./carousels/{date}-{slug}/
  strategy.json      # Content strategy from Phase 1
  slide-1.svg        # Final post-processed slides
  slide-2.svg
  ...
  slide-N.svg
```

---

## Quality Checklist

Before declaring a carousel complete, verify every slide against these rules:

- [ ] Background matches configured design mode
- [ ] All text has proper contrast for the design mode
- [ ] No ALL CAPS text — headlines use Title Case, body uses sentence case
- [ ] Accent colors are professional and not oversaturated
- [ ] Brand gradient applied to max 1-2 elements per slide
- [ ] 30-40% whitespace maintained
- [ ] All content within safe zone (y:300-1100, x:140-920)
- [ ] No invented data or statistics — only user-provided facts
- [ ] No `<defs>`, `<style>`, or `<svg>` tags in Gemini's raw output
- [ ] Post-process.mjs ran successfully for every slide

---

## Content Rules

- **Never invent data or statistics.** Only use facts and numbers the user explicitly provides. If none provided, use conceptual language ("significant growth", not "47% growth").
- **Never use ALL CAPS.** Title Case for headlines, sentence case for body text. No exceptions.
- **Data values must be consistent size** within a slide (pick one size between 40-48px for all data elements).
