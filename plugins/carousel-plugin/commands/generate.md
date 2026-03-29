---
name: carousel:generate
description: Generate a carousel from a topic. Requires brand setup first (/carousel:setup). Uses AI to create professional SVG carousel slides.
argument-hint: "Your topic here"
---

# Carousel Generation

## Pre-flight Checks

1. **Brand profile**: Read `brand-profile.json` from project root. If not found, tell the user to run `/carousel:setup` first and stop.

2. **API key**: Check `OPENROUTER_API_KEY` environment variable. If not set, ask the user for it. This is only needed for Gemini (SVG rendering) — content strategy uses YOU (Claude).

3. **Input**: The user should provide a topic. They may also provide:
   - Additional details/context
   - A URL to extract content from (use WebFetch to get the page content)
   - Desired slide count (3, 5, 7, or 10 — default 5)
   - `--skip-validation` flag to skip the validation pass for faster generation

## Step 1: Content Strategy (YOU — Claude)

YOU are the content strategist. You are already Opus running inside Claude Code — no need to call OpenRouter for this.

Read the strategy system prompt from `prompts/strategy-system.md` (located in the carousel plugin directory). Fill ALL template variables with values from `brand-profile.json`:
- `{{BRAND_NAME}}` → brand.name
- `{{INDUSTRY}}` → brand.brand.industry
- `{{AUDIENCE}}` → brand.brand.audience
- `{{VOICE_GUIDELINES}}` → brand.brand.voice (joined as comma-separated string)
- `{{TONE}}` → brand.content.tone
- `{{DENSITY}}` → brand.content.density
- `{{SLIDE_COUNT}}` → user's requested count or brand.content.slideCount.default
- `{{PREFERRED_FRAMEWORKS}}` → brand.content.frameworks (or "auto" if not set)
- `{{EXCLUDED_FRAMEWORKS}}` → brand.content.excludedFrameworks (or [] if not set)

Then follow that prompt yourself to generate the content strategy JSON. You ARE the strategist — think carefully about:
- Narrative arc across slides
- Framework variety (don't repeat the same framework)
- Data fidelity (ONLY use data the user provides, never invent statistics)
- Headlines that use the user's terminology

Output a JSON object with the strategy. Report to the user: "Strategy complete — generating {N} slides with frameworks: {list frameworks}"

## Template Variable Filling

Before calling Gemini, fill ALL placeholders in the visual system prompt and framework instructions:

| Placeholder | Source (brand-profile.json path) | Default |
|------------|--------------------------------|---------|
| {{FONT_PRIMARY}} | visual.fonts.primary | Inter |
| {{FONT_SECONDARY}} | visual.fonts.secondary | Inter |
| {{COLOR_TEXT}} | visual.colors.text | #FFFFFF |
| {{COLOR_ACCENT}} | visual.colors.accent | (required) |
| {{COLOR_CAPTION}} | visual.colors.caption | #999999 |
| {{GRADIENT_FROM}} | visual.colors.gradient.from | visual.colors.accent |
| {{GRADIENT_TO}} | visual.colors.gradient.to | #FFFFFF |
| {{BACKGROUND_COLOR}} | visual.background.color | #1a1a1a |
| {{DESIGN_MODE}} | visual.designMode | dark |
| {{CONTENT_START}} | visual.canvas.contentStart | 300 |
| {{FOOTER_START}} | visual.canvas.footerStart | 1100 |
| {{SAFE_X_MIN}} | visual.canvas.safeXMin | 140 |
| {{SAFE_X_MAX}} | visual.canvas.safeXMax | 920 |
| {{CANVAS_WIDTH}} | visual.canvas.width | 1080 |
| {{CANVAS_HEIGHT}} | visual.canvas.height | 1350 |
| {{TOPIC}} | from user input | (required) |
| {{HEADLINE}} | from strategy slide data | (per slide) |
| {{FRAMEWORK}} | from strategy slide data | (per slide) |
| {{DATA_POINTS}} | from strategy slide data | (per slide) |
| {{FRAMEWORK_INSTRUCTIONS}} | from frameworks.md | (per framework) |
| {{PREFERRED_FRAMEWORKS}} | content.frameworks | auto |
| {{EXCLUDED_FRAMEWORKS}} | content.excludedFrameworks | [] |

### Derived values (compute from brand profile):
- {{GLASS_FILL}}: If designMode="dark" → COLOR_TEXT. If "light" → BACKGROUND_COLOR
- {{GLASS_OPACITY}}: If dark → 0.04. If light → 0.06

## Step 2: SVG Generation (Gemini via OpenRouter)

This is the ONLY paid API call. Gemini generates the actual SVG visuals — this is what it's best at.

For EACH slide in the strategy, make a WebFetch POST to `https://openrouter.ai/api/v1/chat/completions`:

```json
{
  "model": "google/gemini-2.5-pro",
  "messages": [
    {
      "role": "system",
      "content": "[Load and fill the visual system prompt from prompts/visual-system.md with brand values + this slide's strategy data + the matching framework instructions from prompts/frameworks.md]"
    },
    {
      "role": "user",
      "content": "Generate SVG content elements ONLY for slide {N}: {headline}. Framework: {framework}. Data: {data_points}\n\nIMPORTANT: Output ONLY the inner SVG content elements — NO <svg> wrapper, NO <defs>, NO <style> blocks. Just the raw content elements (text, rect, circle, path, g, etc.) that go inside the slide. The wrapper, gradients, background, and fonts will be added by post-processing."
    }
  ],
  "temperature": 0.2,
  "max_tokens": 16000
}
```

Headers:
```
Authorization: Bearer {OPENROUTER_API_KEY}
Content-Type: application/json
HTTP-Referer: https://github.com/nodeagencyai/Carousel-plugin-claude
X-Title: Carousel Generator
```

After each slide completes:
1. Extract the raw SVG content from the response (strip any markdown code fences if present)
2. Save the raw output to `./carousels/{date}-{slug}/.raw-slide-{N}.svg`
3. Report progress: "Slide {N}/{total} complete"

## Step 3: Post-Processing

After each slide's raw SVG is saved, run the post-processing script:

```bash
node {plugin_root}/scripts/post-process.mjs --input ./carousels/{dir}/.raw-slide-{N}.svg --output ./carousels/{dir}/slide-{N}.svg --brand ./brand-profile.json --slide-number {N} --total-slides {total}
```

Where `{plugin_root}` is the carousel plugin's installation directory (use `${CLAUDE_PLUGIN_ROOT}` if available, otherwise resolve from the plugin path).

The post-processing script handles:
- Ampersand escaping (`&` → `&amp;` for valid XML)
- Unclosed tag repair (tracks open/close tags, appends missing closers)
- Proportional safe zone repositioning (bounding box analysis, uniform scaling, offset — not just clamping)
- Full-canvas rect removal (dark AND light fills, any rect >= 1000x1300)
- Gradient overuse reduction (caps at 2 elements using `url(#brandGradient)`)
- ALL CAPS → Title Case conversion (preserves abbreviations like AI, CEO)
- Font enforcement (replaces hallucinated fonts with brand fonts)
- Gradient injection (7-stop chrome gradient from brand colors)
- Background embedding (solid color, SVG gradient, or raster image)
- SVG wrapping (xmlns, viewBox, defs, style, gradient definitions)
- XML validation (tag balance, invalid characters, attribute quotes)
- Fallback SVG generation on complete failure

**If post-process.mjs fails**: It generates a branded fallback slide instead of crashing. The output JSON includes `validation.warnings` if issues were found but the SVG is still usable.

## Step 4: Validation & Cleanup (YOU — Claude)

Skip this step if the user passed `--skip-validation`.

post-process.mjs handles programmatic validation (gradient capping, ALL CAPS, safe zones, font enforcement). After it runs, read each final SVG and do a quick visual sanity check. Fix only obvious remaining issues.

Report for each slide: "Slide {N} — {passed validation | fixed: brief description}"

## Step 5: Save Strategy & Summary

1. **Save strategy**: Write the strategy JSON to `./carousels/{date}-{slug}/strategy.json`

2. **Report**:
   - Number of slides generated
   - File paths
   - Whether validation was run or skipped
   - Suggest: "Run `/carousel:preview` to see your carousel in the browser"
   - Suggest: "Run `/carousel:regenerate` to modify any specific slide"

## Error Handling & Retry Logic

### Retry with exponential backoff
If a Gemini WebFetch call fails, retry up to 3 times with increasing delays:
- **Attempt 1**: Immediate
- **Attempt 2**: Wait 2 seconds, then retry
- **Attempt 3**: Wait 5 seconds, then retry

Check the response for these specific cases:
- **429 (Rate Limited)**: Always retry with backoff — this is temporary
- **500/502/503 (Server Error)**: Retry with backoff — OpenRouter may be temporarily down
- **401 (Unauthorized)**: Do NOT retry — API key is invalid. Tell user to check their `OPENROUTER_API_KEY`
- **400 (Bad Request)**: Do NOT retry — the prompt is malformed. Show the error

### Malformed SVG recovery
If Gemini returns something that isn't SVG (e.g., explanation text, markdown, or empty):
1. Retry once with simplified instruction: "Return ONLY valid SVG content elements. No markdown, no code fences, no explanations. Just SVG tags: text, rect, circle, path, g, tspan, line."
2. If retry also fails, post-process.mjs will generate a branded fallback slide showing "Slide N — Generation failed, please regenerate"

### Other errors
- If brand-profile.json is missing required fields, tell the user which fields and suggest re-running `/carousel:setup`
- If post-process.mjs fails, it outputs a JSON error. Show it to the user and note the fallback was used
- If post-process.mjs reports `validation.warnings`, mention them but don't block — the SVG is still usable
