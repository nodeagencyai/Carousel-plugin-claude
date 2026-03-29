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

## Step 1: Content Strategy (Opus via OpenRouter)

Make a WebFetch POST request to `https://openrouter.ai/api/v1/chat/completions` with:

```json
{
  "model": "anthropic/claude-opus-4",
  "messages": [
    {
      "role": "system",
      "content": "[Load and fill the strategy system prompt from prompts/strategy-system.md with brand values from brand-profile.json]"
    },
    {
      "role": "user",
      "content": "Create a carousel strategy for: {user's topic}\n\nDetails: {user's details if any}"
    }
  ],
  "temperature": 0.3,
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
      "content": "Generate SVG for slide {N}: {headline}. Framework: {framework}. Data: {data_points}"
    }
  ],
  "temperature": 0.2,
  "max_tokens": 16000
}
```

After each slide completes, report progress: "Slide {N}/{total} complete"

## Step 3: Post-Processing

For each SVG returned by Gemini:

1. **Extract SVG content** — get the raw SVG from the response (strip any markdown code fences if present)

2. **Wrap in proper SVG structure**:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="{canvas.width}" height="{canvas.height}" viewBox="0 0 {canvas.width} {canvas.height}">
  <defs>
    <style>
      text { font-family: '{font.primary}', '{font.secondary}', sans-serif; }
    </style>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{gradient.from}"/>
      <stop offset="50%" stop-color="{gradient.to}"/>
      <stop offset="100%" stop-color="{gradient.from}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="{canvas.width}" height="{canvas.height}" fill="{background.color}"/>

  <!-- Generated content -->
  {gemini_svg_content}
</svg>
```

3. **Write to file**: Save each slide to `./carousels/{date}-{slug}/slide-{N}.svg`

4. **Save strategy**: Write the Opus strategy JSON to `./carousels/{date}-{slug}/strategy.json`

## Step 4: Summary

Report:
- Number of slides generated
- File paths
- Suggest: "Run `/carousel:preview` to see your carousel in the browser"
- Suggest: "Run `/carousel:regenerate` to modify any specific slide"

## Error Handling

- If OpenRouter returns an error, show the error message and suggest checking the API key
- If Gemini returns malformed SVG, retry once with the instruction "Return ONLY valid SVG code, no markdown"
- If brand-profile.json is missing required fields, tell the user which fields and suggest re-running /carousel:setup
