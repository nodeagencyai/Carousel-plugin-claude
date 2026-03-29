# Visual Framework Definitions

> These are GUIDELINES, not rigid templates. Each carousel should feel unique. Vary layouts, sizes, and spacing within these constraints. The only hard rules are the safe zone boundaries.

**LIGHT MODE RULE:** On light backgrounds (designMode='light'), increase ALL opacity values by 50% compared to dark mode. Light backgrounds absorb subtlety — be bolder.

---

## SAFE ZONE (ALL FRAMEWORKS)

```
HARD BOUNDARIES (never violate):
- Content zone:    y:300-1100, x:140-920
- Canvas center:   x=530, y=700
- Canvas:          1080 x 1350

Headlines:         y >= 320, NEVER in the logo zone (y < 280)
Last element:      y <= 1100, NEVER in the footer zone
```

---

## HERO

**Opening slides. Bold statements. Maximum impact.**

Guidelines:
- Headline LARGE: 84-96px, centered. This IS the slide.
- ONE keyword with brand gradient via `<tspan fill="url(#brandGradient)">word</tspan>`
- Optional subtitle below headline (32-36px, caption color)
- Optional accent line or decorative element
- If there's a key metric, make it MASSIVE (80-120px) — the biggest element on slide
- Keep 60%+ of canvas empty. Less is more.
- NO data visualizations, NO complex layouts

Think Apple keynote opening. The power comes from what you leave out.

---

## DATA_TABLE

**Structured comparisons. Feature lists. Side-by-side data.**

Guidelines:
- Clean rows with subtle separators (stroke-opacity 0.08)
- Column headers in primary font, smaller and muted (caption color)
- Data values clear and readable (26-32px)
- One key value per row may use brandGradient
- Generous row height — at least 70-80px per row
- Maximum 6 rows, 3 columns
- Optional alternating row backgrounds (fill-opacity 0.02-0.04)
- Table should feel like a premium financial report, not a spreadsheet

Vary it: Sometimes left-aligned, sometimes centered. Sometimes with icons. Sometimes with highlight rows. Don't always start at the same y-position.

---

## BAR_CHART

**Quantitative comparisons. Rankings. Performance metrics.**

Guidelines:
- Maximum 3 bars — more gets crowded
- Labels ABOVE bars, values to the RIGHT — never overlapping
- Bars: 30-50px height, thin and elegant (not chunky Excel bars)
- Bar tracks (background): subtle fill-opacity 0.06
- Actual bars: solid fill, accent color or text color
- Generous spacing between bars — at least 100px gap between bar groups
- Highest value gets brandGradient treatment
- On light backgrounds, make bars 40-50px and use SOLID accent color fills

DON'T always put bars at the same y-positions. Vary the starting point, spacing, and bar width based on the data. Sometimes bars start higher, sometimes lower. Sometimes they're wider. Make each bar chart feel custom.

### Common Mistakes
- DO NOT place values inside bars
- DO NOT make bars overlap or touch
- DO NOT use more than 3 bars

---

## QUADRANT

**2x2 matrices. Strategic positioning. Two-axis comparisons.**

Guidelines:
- Intersection point roughly centered in content area
- Hairlines: horizontal and vertical, subtle (stroke-opacity 0.15)
- Four distinct zones — each tells part of the story
- Quadrant labels bold (28-32px), quadrant descriptions muted
- Axis labels at endpoints (18-20px, tertiary color)
- Maximum 2-3 items per quadrant
- One quadrant may be highlighted with subtle background fill
- Keep 100px buffer from edges for axis labels

Vary it: The intersection doesn't have to be dead center. Offset it for asymmetric tension. Use circles or badges for data points instead of just text.

---

## STACK

**Layered concepts. Hierarchies. Building blocks.**

Guidelines:
- 2-3 layers (not always 3 — sometimes 2 is cleaner)
- Each layer is a glass morphism card (fill-opacity 0.04-0.08, rx=12)
- Top layer brightest, descending opacity creates depth
- Layer height: 150-220px with 30-60px gaps
- Each layer has title + description
- On light backgrounds: increase opacity to 0.06-0.12, use solid borders

DON'T always stack top-to-bottom with identical sizes. Try:
- Varying layer heights (larger = more important)
- Offsetting layers horizontally for visual interest
- Using different container styles (some with borders, some without)
- Numbering layers or adding icons

---

## FLOW

**Processes. Timelines. Sequential steps.**

Guidelines:
- 3-5 steps connected by lines or arrows
- Can be horizontal (left to right) or vertical (top to bottom) — vary it!
- Step indicators: numbered circles, icons, or badges (40-60px)
- Connecting lines with arrows showing direction
- One step may be "active" (highlighted with gradient)
- Labels clear and concise
- Equal spacing between steps

DON'T always do horizontal left-to-right. Try:
- Vertical top-to-bottom flow
- Zigzag path
- Circular/curved flow
- Steps as cards connected by arrows

---

## RADIANCE

**Central concept with supporting elements. Hub-and-spoke.**

Guidelines:
- Bold center element: circle (r=50-70), filled with brandGradient or accent color
- Center label inside (1-3 words, primary font)
- 4-6 spokes radiating outward
- Spoke labels at endpoints (22-26px)
- Connecting lines from center (stroke-opacity 0.12)
- Maximum radius ~300px to stay in safe zone
- Avoid placing spokes at 12 o'clock (collides with headline)

Vary it: Center doesn't have to be a circle — try a rounded rect, a badge, or just bold text. Spokes don't have to be straight lines — try curves or dotted lines.

---

## THE_SHIFT

**Before/after. Transformations. Old vs. new.**

Guidelines:
- Vertical divider splitting the slide (around x=530)
- Left side: "Before" — subdued, caption color, lower opacity
- Right side: "After" — bold, text color or gradient, high contrast
- "Before" and "After" labels near the top
- Maximum 4 comparison pairs, aligned vertically across the divide
- Arrow or transition indicator at the divider midpoint
- The contrast between sides should be OBVIOUS — before feels old/dim, after feels new/bright

Vary it: The divider doesn't have to be a straight line. Try:
- Diagonal split
- Overlapping zones with different opacity
- Before/after as two stacked sections instead of side-by-side

---

## Framework Selection Guide

| Content Type | Recommended | Why |
|---|---|---|
| Opening/title | HERO | Maximum impact, minimal distraction |
| Feature comparison | DATA_TABLE | Structured, scannable |
| Performance metrics | BAR_CHART | Visual weight conveys magnitude |
| Strategic positioning | QUADRANT | Two-axis reveals insights |
| Hierarchy/priorities | STACK | Depth implies importance |
| Process/timeline | FLOW | Direction guides understanding |
| Ecosystem/features | RADIANCE | Context radiates from core |
| Before/after | THE_SHIFT | Clear divide between states |
