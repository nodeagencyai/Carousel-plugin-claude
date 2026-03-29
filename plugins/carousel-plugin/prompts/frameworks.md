# Visual Framework Definitions

This file contains the spatial rules and layout instructions for each carousel visual framework. These are injected into the visual generation prompt as `{{FRAMEWORK_INSTRUCTIONS}}` based on the strategy's chosen framework for each slide.

---

## ABSOLUTE CONSTRAINTS (ALL FRAMEWORKS)

These constraints are enforced strictly. Every framework must obey them.

```
SAFE AREA (absolute):    x:89-972, y:73-1252
PRACTICAL SAFE AREA:     x:140-920, y:150-1150  ← USE THIS!

TOP BUFFER:              y:73-150 is LOGO AREA — keep empty except tiny accents
BOTTOM BUFFER:           y:1150-1350 is BRANDING — absolutely NO content
SIDE BUFFERS:            50px minimum margins (x:140 and x:920)

POSITIONING RULES:
- Headlines:             Start at y:320 MINIMUM (NEVER LOWER — this is critical!)
- Subheadlines:          Start at y:380 if present
- Body content:          Keep between y:420-1000
- Bottom elements:       MUST end before y:1100
- Calculate text height: baseline + descenders + line-height

Canvas center X:         x=530
Canvas center Y:         y=700
Canvas size:             1080 x 1350
```

---

## HERO

**Use for**: Opening slides, powerful statements, brand impact moments.

**Philosophy**: Minimal. Think Apple keynote opening slide. The power comes from what you leave out, not what you put in. Maximum 60% of the canvas should be empty space. No data visualizations.

### Spatial Rules
```
Headline:       Centered at y=600-650
                font-size: 84-96px ({{FONT_PRIMARY}})
                text-anchor: middle, x=530
                letter-spacing: -0.02em
                fill: {{COLOR_TEXT}}

MANDATORY GRADIENT KEYWORD:
                One keyword MUST use brand gradient via <tspan>:
                Example: The future is <tspan fill="url(#brandGradient)">autonomous</tspan>
                DO NOT make entire headline gradient — ONLY one impactful word
                Text structure: white fill base with <tspan> for gradient word
                Choose the most impactful word (key concept or action word)

Subtitle:       Optional, at y=720
                font-size: 32-36px ({{FONT_SECONDARY}})
                fill: {{COLOR_CAPTION}}
                letter-spacing: 0em

Accent line:    Optional subtle decorative line below headline
                width: 150-200px, centered at x=530
                stroke: url(#brandGradient), 2-3px

All text x >= 140
```

### Rules
- NO data visualizations, charts, or complex layouts
- NO more than 2-3 text elements total
- Keep 60%+ of canvas empty
- The headline IS the slide — make it count
- Color mode MUST be mixed_highlight

### Example Structure
```xml
<text x="530" y="630" text-anchor="middle"
      font-family="{{FONT_PRIMARY}}" font-size="90" fill="{{COLOR_TEXT}}"
      letter-spacing="-0.02em">
  The Future is <tspan fill="url(#brandGradient)">Autonomous</tspan>
</text>
<text x="530" y="720" text-anchor="middle"
      font-family="{{FONT_SECONDARY}}" font-size="36" fill="{{COLOR_CAPTION}}"
      letter-spacing="0em">
  Why the next decade belongs to AI-native companies
</text>
```

---

## DATA_TABLE

**Use for**: Structured comparisons, feature lists, specifications, side-by-side data.

**Philosophy**: Clean, scannable information. The table should feel like a premium financial report, not a spreadsheet. Generous row height, subtle separators, typographic hierarchy.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})
                text-anchor: middle, x=530

Table starts:   y=400

Column headers: y=420
                font-family: {{FONT_PRIMARY}} (Satoshi-Bold)
                font-size: 22-24px
                fill: {{COLOR_CAPTION}}

First data row: y=500
Row spacing:    80px
Last row:       MUST be above y=1050

Content:        between x=180 and x=900

Table width:    Max 720px, centered horizontally
                Left edge: x=180
                Right edge: x=900

Data values:    font-family: {{FONT_SECONDARY}} (Satoshi-Medium)
                font-size: 26-28px
                fill: {{COLOR_TEXT}}

Row separators: Horizontal lines
                stroke: {{COLOR_TEXT}}, stroke-opacity: 0.08, 0.5px

Row backgrounds: Alternating fill-opacity (0.02 and 0.04) for subtle striping
```

### Rules
- Maximum 6 rows to maintain readability
- Maximum 3 columns to prevent crowding
- One key value per row may use brandGradient fill
- Cell padding: 30px horizontal, centered vertically in row
- Header row gets a slightly stronger background (fill-opacity: 0.06)
- Last row must end before y=1050 — calculate total height before rendering

---

## BAR_CHART

**Use for**: Quantitative comparisons, rankings, performance metrics. ONLY use when user provided actual comparable numerical values.

**Philosophy**: Thin, elegant horizontal bars. Not Excel charts — think editorial data visualization. The bars should feel effortless, like they belong in a design magazine.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

MAXIMUM 3 BARS — calculate ALL positions BEFORE drawing to prevent overlap!

EXACT POSITIONING (use these coordinates, do NOT compute your own):

Bar 1:          Label y=480
                Bar   y=510 to y=540 (height 30px)
                Value y=525

Bar 2:          Label y=680
                Bar   y=710 to y=740 (height 30px)
                Value y=725

Bar 3:          Label y=880
                Bar   y=910 to y=940 (height 30px)
                Value y=925

Row spacing:    200px (gives 170px breathing room to prevent ANY overlap)

BAR SPECIFICATIONS:
- Bar height:   30px (thin and elegant — NOT 40px)
- Bar max width: 400px
- Bar start:    x=200 (or x=140)
- Background track: same y position, width to x=880
                    fill: {{COLOR_TEXT}}, fill-opacity: 0.06, rx: 4
- Actual bar:   fill: {{COLOR_TEXT}}, fill-opacity: 0.9, rx: 4

LABELS:         ABOVE bars (y = bar_y - 30px)
                x=200
                font-family: {{FONT_SECONDARY}} (Satoshi-Medium)
                font-size: 24px
                fill: {{COLOR_CAPTION}}

VALUES:         To the RIGHT of bars — NO OVERLAPPING TEXT
                x = bar_end + 20px (or x=600 if bar is narrow, x=900 if bar is wide)
                font-family: {{FONT_PRIMARY}} (Satoshi-Bold)
                font-size: 40-48px
                fill: url(#brandGradient) for the highest value
                fill: {{COLOR_TEXT}} for others
```

### COMMON MISTAKES TO AVOID
- DO NOT place values inside bars
- DO NOT use computed y-offset calculations — use the EXACT y coordinates above
- DO NOT make bars taller than 30px
- DO NOT place any text with y > 1150
- DO NOT use more than 3 bars

### Rules
- **Maximum 3 bars** to maintain generous spacing
- Labels ALWAYS above bars, values ALWAYS to the right — NO overlap
- The largest value gets brandGradient treatment
- All data values: consistent 40-48px size

---

## QUADRANT

**Use for**: 2x2 matrices, comparing items along two dimensions, strategic positioning maps.

**Philosophy**: Clean intersecting lines create four distinct zones. Each quadrant tells part of the story. The intersection point is the visual anchor.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Intersection:   x=530, y=650

Hairlines:      Horizontal: from x=140 to x=920 at y=650
                Vertical:   x=530 from y=250 to y=1050
                stroke: {{COLOR_TEXT}}, stroke-opacity: 0.15, stroke-width: 1px

Axis labels:    font-family: {{FONT_SECONDARY}}, font-size: 18-20px
                fill: {{COLOR_CAPTION}}, positioned at line endpoints

Quadrant labels:
  Top-left:     x=200, y=500
  Top-right:    x=700, y=500
  Bottom-left:  x=200, y=850
  Bottom-right: x=700, y=850
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}

Quadrant data:  font-family: {{FONT_SECONDARY}}, font-size: 22-24px
                fill: {{COLOR_CAPTION}}
                Positioned below quadrant label with 30px gap
```

### Rules
- Keep 100px buffer from all edges for axis labels
- Data objects centered in their respective quadrant
- Maximum 2-3 items per quadrant
- One quadrant may use a subtle glass morphism background (fill-opacity: 0.04) to highlight it
- Axis labels should be descriptive (e.g., "Low Effort" / "High Effort", "Low Impact" / "High Impact")

---

## STACK

**Use for**: Layered concepts, hierarchies, progressive steps, priority tiers, building blocks.

**Philosophy**: Glass slabs stacked vertically with subtle depth. Each layer builds on the one below. Think of transparent panels floating in space with content inside.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

3 LAYERS MAX (not 4):

Layer 1:        y=350 to y=550 (height 200px)
Layer 2:        y=600 to y=800 (height 200px)
Layer 3:        y=850 to y=1050 (height 200px)

Gap:            50px between layers
MUST fit:       within y=350 to y=1050
Contained:      within x=180 to x=900

Layer container: <rect x="..." y="..." width="..." height="200"
                  fill="white" fill-opacity="0.04"
                  stroke="{{COLOR_TEXT}}" stroke-opacity="0.1"
                  rx="12"/>
                Optional subtle drop shadow via filter

Top layer:      fill-opacity="0.06" (descending: 0.05, 0.04)

Layer number:   x = layer_left + 40px, y = layer_y + 110px
                font-family: {{FONT_PRIMARY}}, font-size: 40px
                fill: url(#brandGradient) (for top layer only, {{COLOR_CAPTION}} for others)

Layer title:    x = layer_left + 100px, y = layer_y + 95px
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}

Layer desc:     x = layer_left + 100px, y = title_y + 32px
                font-family: {{FONT_SECONDARY}}, font-size: 22-24px
                fill: {{COLOR_CAPTION}}

Text inside:    40px horizontal padding from layer edges
```

### Rules
- **Maximum 3 layers** to maintain spacing and readability
- Verify: last layer bottom (y=1050) stays at or below y=1050
- Top layer has slightly higher fill-opacity (0.06) to indicate priority
- Each layer must have both a title and description
- Glass containers: `fill="white" fill-opacity="0.04" stroke-opacity="0.1" rx="12"`
- Optional: subtle drop shadow on layers via `<filter>` for depth

---

## FLOW

**Use for**: Processes, timelines, sequential steps, cause-and-effect chains, pipelines.

**Philosophy**: Directional energy moving left to right. Clean nodes connected by lines or arrows. The eye should naturally follow the flow.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Horizontal flow: from x=150 to x=920
                 3-5 nodes with connecting lines

Nodes:          Centered at y=650 (center of safe area)

Labels above:   y=580
                font-family: {{FONT_PRIMARY}}, font-size: 24-28px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Labels below:   y=720
                font-family: {{FONT_SECONDARY}}, font-size: 20-24px
                fill: {{COLOR_CAPTION}}

Arrows:         Directional arrows or gradient fade between nodes
                stroke: url(#brandGradient), stroke-width: 2px
```

### Rules
- Maximum 5 steps (3-5 nodes is optimal)
- Ensure equal spacing between all nodes
- Arrows/connectors must clearly indicate direction (left to right)
- One step may be "active" (highlighted with brandGradient stroke, slightly larger)
- Labels must not overlap — reduce font size if needed to maintain spacing
- All elements within x=150 to x=920

---

## RADIANCE

**Use for**: Central concepts with supporting elements, hub-and-spoke models, ecosystem maps, feature highlights around a core idea.

**Philosophy**: A single powerful concept at the center with supporting ideas radiating outward. The center demands attention; the spokes provide context. Like a sun with rays.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Center point:   x=530, y=600

Central element: Circle at center
                 r=60
                 fill: url(#brandGradient)

Central label:  Inside central element
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Maximum radius: 300px (to stay within safe zone)
Data objects:   Positioned at r=250px from center

Radiating items: 4-6 items at equal angles around center

Connecting lines: From center outward to spoke positions
                 stroke: {{COLOR_TEXT}}, stroke-opacity: 0.12
                 stroke-width: 1px

Spoke labels:   Positioned at spoke endpoints
                font-family: {{FONT_SECONDARY}}, font-size: 22-26px
                fill: {{COLOR_TEXT}}
                text-anchor adjusted based on position (start for right side, end for left)

Spoke details:  Below spoke labels
                font-family: {{FONT_SECONDARY}}, font-size: 18-20px
                fill: {{COLOR_CAPTION}}
```

### Rules
- Maximum 6 spokes (4-5 is optimal for readability)
- Each spoke must stay entirely within the safe zone (x=140-920, y=150-1150)
- The central element should contain the core concept (1-3 words max)
- Center circle: r=60, fill with brandGradient
- Spokes at top/bottom should have labels to the side to avoid overlap with headline/footer
- One spoke may be visually emphasized (brandGradient stroke on its line, bolder label)
- Avoid placing spokes at exact top (12 o'clock) position to prevent headline collision
- Start spoke placement at roughly 2 o'clock and distribute clockwise

---

## THE_SHIFT

**Use for**: Before/after comparisons, transformations, paradigm shifts, old vs. new contrasts.

**Philosophy**: A clear visual divide between two states. The left side represents the old/before state at low opacity, the right side the new/after state at high contrast. The divider creates tension and the eye moves naturally from left to right.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Vertical divider: x=530, from y=280 to y=1100
                  stroke: {{COLOR_TEXT}}, stroke-opacity: 0.15, stroke-width: 1px

Left zone:      x=140 to x=520 — "Before" state (low opacity)
Right zone:     x=540 to x=920 — "After" state (high contrast)

"Before" label: x=250, y=400
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_CAPTION}}

"After" label:  x=740, y=400
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: url(#brandGradient)

Left side items: x=140 to x=500
                 Starting y=480, spacing 120px between items
                 font-family: {{FONT_SECONDARY}}, font-size: 24-28px
                 fill: {{COLOR_TEXT}}

Right side items: x=560 to x=920
                  Starting y=480, spacing 120px between items
                  font-family: {{FONT_SECONDARY}}, font-size: 24-28px
                  fill: {{COLOR_TEXT}}

Maximum:        4 comparison pairs

Arrow/transition: At divider midpoint (x=530, y=725)
                  Small arrow or indicator pointing right
                  fill: url(#brandGradient)
```

### Rules
- Maximum 4 comparison pairs to maintain readability
- Left side items aligned left (text-anchor: start), right side items aligned left (text-anchor: start)
- "Before" label uses caption color (subdued), "After" label uses brandGradient (emphasis)
- Arrow or transition indicator at the vertical midpoint of the divider
- Keep consistent vertical alignment between left and right items (same y-coordinates)
- All content must stay within y=280 to y=1100

---

## Framework Selection Guide

| Content Type | Recommended Framework | Why |
|---|---|---|
| Opening/title slide | HERO | Maximum impact, minimal distraction |
| Feature comparison | DATA_TABLE | Structured, scannable rows |
| Performance metrics | BAR_CHART | Visual weight of bars conveys magnitude |
| Strategic positioning | QUADRANT | Two-axis comparison reveals insights |
| Hierarchy/priorities | STACK | Layered depth implies importance order |
| Process/timeline | FLOW | Directional movement guides understanding |
| Ecosystem/features | RADIANCE | Central concept with context radiating out |
| Before/after contrast | THE_SHIFT | Clear visual divide between two states |
