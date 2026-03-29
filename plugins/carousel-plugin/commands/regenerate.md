---
name: carousel:regenerate
description: Regenerate a specific slide in your last carousel with custom instructions.
argument-hint: slide 3 "make it a bar chart instead"
---

# Slide Regeneration

## Input Parsing

The user provides:
- A slide number (required)
- Modification instructions (required) — what to change about the slide

## Pre-flight

1. Find the most recent carousel directory in `./carousels/` (sort by date prefix)
2. Read `strategy.json` from that directory to get the original slide strategy
3. Read the existing `slide-{N}.svg` to understand what's currently there
4. Read `brand-profile.json` for brand values

If no carousel directory exists, tell user to run `/carousel:generate` first.

## Regeneration

1. Take the original slide strategy from strategy.json for the specified slide number
2. Modify the strategy based on user instructions (e.g., change framework, update headline)
3. Call Gemini via OpenRouter with the updated brief:

WebFetch POST to `https://openrouter.ai/api/v1/chat/completions`:
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "[Visual system prompt with brand values]"
    },
    {
      "role": "user",
      "content": "Regenerate slide {N} with these changes: {user_instructions}\n\nOriginal strategy: {original_slide_strategy}\n\nGenerate SVG for: {updated_headline}. Framework: {updated_framework}."
    }
  ],
  "temperature": 0.3,
  "max_tokens": 16000
}
```

4. Post-process the SVG (same wrapping as generate)
5. Overwrite `slide-{N}.svg` in the carousel directory
6. Update strategy.json with the modified slide data

Report: "Slide {N} regenerated. Run `/carousel:preview` to see the update."
