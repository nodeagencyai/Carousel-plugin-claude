---
name: carousel:generate
description: Generate a carousel from a topic. Requires brand setup first (/carousel:setup). Uses AI to create professional SVG carousel slides.
argument-hint: "Your topic here"
---

# Carousel Generation

## Pre-flight Checks

1. **Brand profile**: Read `brand-profile.json` from project root. If not found, tell the user to run `/carousel:setup` first and stop.

2. **API key**: Check `OPENROUTER_API_KEY` environment variable. If not set, ask the user for it.

3. **Input**: The user should provide a topic. They may also provide:
   - Additional details/context
   - A URL to extract content from (use WebFetch to get the page content)
   - Desired slide count (3, 5, 7, or 10 — default 5)
   - `--skip-validation` flag to skip the Opus validation pass for faster generation

## Step 1: Content Strategy (Opus via OpenRouter)

Make a WebFetch POST request to `https://openrouter.ai/api/v1/chat/completions` with:

```json
{
  "model": "anthropic/claude-opus-4",
  "messages": [
    {
      "role": "system",
      "content": "[Load the strategy system prompt from prompts/strategy-system.md. Fill ALL template variables with values from brand-profile.json — brand name, tone, density, audience, industry, voice guidelines, frameworks, etc. Every {placeholder} must be replaced with the actual brand profile value before sending.]"
    },
    {
      "role": "user",
      "content": "Create a carousel strategy for: {user's topic}\n\nDetails: {user's details if any}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

Headers:
```
Authorization: Bearer {OPENROUTER_API_KEY}
Content-Type: application/json
HTTP-Referer: https://github.com/nodeagencyai/Carousel-plugin-claude
X-Title: NODE Carousel Generator
```

Parse the JSON response from the strategy. Report to the user: "Strategy complete — generating {N} slides with frameworks: {list frameworks}"

## Step 2: SVG Generation (Gemini via OpenRouter)

For EACH slide in the strategy, make a WebFetch POST to the same endpoint with:

```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "[Load and fill the visual system prompt from prompts/visual-system.md with brand values + this slide's strategy data + framework instructions from prompts/frameworks.md]"
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
- Gradient injection (brand gradient definitions)
- Background embedding (solid color or background image from brand profile)
- Safe zone validation (content area y:300-1100, x:140-920)
- Black rect removal (strips any full-size black rectangles Gemini may add)
- Font CSS injection (Google Fonts or system font declarations)
- Proper SVG wrapping (xmlns, viewBox, width/height from canvas config)

**If post-process.mjs fails**: Show the error to the user and fall back to the raw SVG file (copy `.raw-slide-{N}.svg` to `slide-{N}.svg` as-is). Warn that the slide may need manual cleanup.

## Step 4: Opus Validation Pass (Optional)

Skip this step if the user passed `--skip-validation` or explicitly asked for faster generation.

After ALL slides are generated and post-processed, do one final quality check. For each `slide-{N}.svg`:

1. Read the post-processed SVG file content
2. Send to Opus via OpenRouter:

```json
{
  "model": "anthropic/claude-opus-4",
  "messages": [
    {
      "role": "user",
      "content": "Review this SVG for quality issues. Check: 1) No elements outside safe zone (y:300-1100, x:140-920), 2) No ALL CAPS text, 3) No overlapping elements, 4) Gradient used on max 1-2 elements. If issues found, output the corrected SVG. If no issues, output the SVG unchanged.\n\n{svg_content}"
    }
  ],
  "temperature": 0.1,
  "max_tokens": 16000
}
```

Headers: same as Step 1.

3. If Opus returned a modified SVG (different from the input):
   - Save Opus's output to `.raw-slide-{N}.svg` (overwrite)
   - Re-run the post-process script to ensure the wrapper and brand assets are intact
   - Report: "Slide {N} — quality issues fixed"
4. If Opus returned the SVG unchanged:
   - Report: "Slide {N} — passed validation"

## Step 5: Save Strategy & Summary

1. **Save strategy**: Write the Opus strategy JSON to `./carousels/{date}-{slug}/strategy.json`

2. **Report**:
   - Number of slides generated
   - File paths
   - Whether validation was run or skipped
   - Suggest: "Run `/carousel:preview` to see your carousel in the browser"
   - Suggest: "Run `/carousel:regenerate` to modify any specific slide"

## Error Handling

- If OpenRouter returns an error, show the error message and suggest checking the API key
- If Gemini returns malformed SVG, retry once with the instruction "Return ONLY valid SVG content elements, no markdown, no svg wrapper"
- If brand-profile.json is missing required fields, tell the user which fields and suggest re-running /carousel:setup
- If post-process.mjs fails, show the error and fall back to the raw SVG (see Step 3)
- If Opus validation changes the SVG, re-run post-process to ensure the wrapper is intact (see Step 4)
