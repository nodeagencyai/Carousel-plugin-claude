# NODE Carousel Generator Plugin

## What This Plugin Does

This plugin generates professional carousel slides using a two-phase AI pipeline via OpenRouter.

**Phase 1 — Content Strategy (Claude Opus):** Takes a topic and generates structured slide briefs including content frameworks, headlines, body copy, and data objects. Output is a `strategy.json` file.

**Phase 2 — Visual Rendering (Gemini Pro 3):** Takes each slide brief and generates SVG content per slide, producing individual `slide-N.svg` files.

## API Configuration

- **API Key Resolution:** Check the `OPENROUTER_API_KEY` environment variable first. If not set, fall back to plugin settings.
- **All API calls** go to: `https://openrouter.ai/api/v1/chat/completions`
- Phase 1 model: `anthropic/claude-opus-4` (content strategy)
- Phase 2 model: `google/gemini-pro-3` (SVG rendering)

## Brand Configuration

Brand identity is stored in `brand-profile.json` in the user's project root. This file contains colors, fonts, logo references, tone of voice, and visual style preferences. The plugin reads this file before every generation run to ensure brand consistency.

## Output Structure

All generated carousels are saved to:

```
./carousels/{date}-{slug}/
  strategy.json    # Full content strategy from Phase 1
  slide-1.svg      # Individual slide files
  slide-2.svg
  slide-N.svg
```

## Canvas Specifications

- **Canvas size:** 1080 x 1350px (portrait, optimized for Instagram/LinkedIn)
- **Safe zone:** x: 140-920, y: 280-1150
- All text and critical visual elements must stay within the safe zone.

## Content Rules

- **Never invent data or statistics.** Only use facts, numbers, and data points that the user explicitly provides. If a slide brief calls for data and none was given, use a placeholder label like "[Your stat here]" or ask the user.
- **Never use ALL CAPS.** Use Title Case for headlines and sentence case for body text. This applies to all generated text content without exception.
