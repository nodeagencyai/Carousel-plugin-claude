# Visual Framework Definitions

This file contains the spatial rules and layout instructions for each carousel visual framework. These are injected into the visual generation prompt as `{{FRAMEWORK_INSTRUCTIONS}}` based on the strategy's chosen framework for each slide.

All frameworks operate within the safe zone:
- **Top boundary**: y=300 (first content element)
- **Bottom boundary**: y=1100 (nothing below this)
- **Left boundary**: x=140
- **Right boundary**: x=920
- **Canvas center X**: x=530
- **Canvas center Y**: y=700

These are defaults. If the brand profile specifies different values, Claude will substitute them before calling you.

---

## HERO

**Use for**: Opening slides, powerful statements, brand impact moments.

**Philosophy**: Minimal. Think Apple keynote opening slide. The power comes from what you leave out, not what you put in. Maximum 60% of the canvas should be empty space.

### Spatial Rules
```
Headline:       y=420-500 (large, bold, centered)
                font-size: 84-96px ({{FONT_PRIMARY}})
                text-anchor: middle, x=530
                letter-spacing: -0.02em

Gradient word:  MANDATORY - one keyword MUST use brand gradient
                <tspan fill="url(#brandGradient)">keyword</tspan>
                Choose the most impactful word (key concept or action word)
                DO NOT make entire headline gradient - ONLY one word

Key metric:     y=550-650 (center focus, optional)
                font-size: 40-48px
                Only if a single standout number is provided

Supporting text: y=750-850
                font-size: 32-36px ({{FONT_SECONDARY}})
                fill: {{COLOR_CAPTION}}
                letter-spacing: 0em
                Optional - only if subheadline is provided

Accent line:    Optional subtle decorative line below headline
                width: 150-200px, centered at x=530, stroke: url(#brandGradient), 2-3px

All text x >= 140
```

### Rules
- NO data visualizations, charts, or complex layouts
- NO more than 2-3 text elements total
- Keep 60%+ of canvas empty
- The headline IS the slide - make it count
- Color mode MUST be mixed_highlight
- Text structure: white fill base with `<tspan>` for gradient keyword

### Example Structure
```xml
<text x="530" y="460" text-anchor="middle"
      font-family="{{FONT_PRIMARY}}" font-size="84" fill="{{COLOR_TEXT}}"
      letter-spacing="-0.02em">
  The Future is <tspan fill="url(#brandGradient)">Autonomous</tspan>
</text>
<text x="530" y="540" text-anchor="middle"
      font-family="{{FONT_SECONDARY}}" font-size="32" fill="{{COLOR_CAPTION}}"
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

Data values:    font-family: {{FONT_SECONDARY}}, font-size: 26-28px
                fill: {{COLOR_TEXT}}

Row separators: Horizontal lines, stroke: {{COLOR_TEXT}}, stroke-opacity: 0.08, 0.5px

Row backgrounds: Alternating fill-opacity (0.02 and 0.04) for subtle striping
```

### Rules
- Maximum 6 rows to maintain readability
- Maximum 3 columns to prevent crowding
- One key value per row may use brandGradient fill
- Cell padding: 30px horizontal, centered vertically in row
- Header row gets a slightly stronger background (fill-opacity: 0.06)
- Last row must end before y=1050 - calculate total height before rendering

---

## BAR_CHART

**Use for**: Quantitative comparisons, rankings, performance metrics. ONLY use when user provided actual comparable numerical values.

**Philosophy**: Thin, elegant horizontal bars. Not Excel charts - think editorial data visualization. The bars should feel effortless, like they belong in a design magazine.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

MAXIMUM 3 BARS (NOT 4):

Bar 1:          Label y=480
                Bar y=510 to y=540 (height 30px)
                Value at y=525

Bar 2:          Label y=680
                Bar y=710 to y=740 (height 30px)
                Value at y=725

Bar 3:          Label y=880
                Bar y=910 to y=940 (height 30px)
                Value at y=925

BAR SPECIFICATIONS:
- Bars from x=200 to variable width, max x=880
- Bar height: 30px (thin and elegant)
- Background track: same y position, width from x=200 to x=880, fill: {{COLOR_TEXT}}, fill-opacity: 0.06, rx: 4
- Actual bar: fill: {{COLOR_TEXT}}, fill-opacity: 0.9, rx: 4

Labels:         ABOVE bars (y = bar_y - 30px)
                x=200
                font-family: {{FONT_SECONDARY}}, font-size: 24px
                fill: {{COLOR_CAPTION}}

Values:         To the RIGHT of bars — NO OVERLAPPING TEXT
                x = bar_end + 20px (or x=900 if bar is wide)
                font-family: {{FONT_PRIMARY}}, font-size: 40-48px
                fill: url(#brandGradient) for the highest value, {{COLOR_TEXT}} for others
```

### Rules
- **Maximum 3 bars** to maintain generous spacing
- Labels ALWAYS above bars, values ALWAYS to the right — NO overlap
- DO NOT place values inside bars
- DO NOT use computed y-offset calculations — use the EXACT y coordinates above
- DO NOT make bars taller than 30px
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

Intersection:   x=530, y=700

Hairlines:      Horizontal: from x=140 to x=920, y=700
                Vertical: x=530, from y=400 to y=1050
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
- Keep 80px buffer from safe zone edges for axis labels
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

Layer 1:        y=400 to y=580 (height 180px)
Layer 2:        y=620 to y=800 (height 180px)
Layer 3:        y=840 to y=1020 (height 180px)

Gap:            40px between layers
MUST fit:       within y=400 to y=1050

Layer container: <rect x="..." y="..." width="..." height="180"
                  fill="white" fill-opacity="0.04"
                  stroke="{{COLOR_TEXT}}" stroke-opacity="0.1"
                  rx="12"/>
                Optional subtle drop shadow via filter

Top layer:      fill-opacity="0.06" (descending: 0.05, 0.04)
Layer width:    80% of safe zone width, centered horizontally

Layer number:   x = layer_left + 40px, y = layer_y + 98px
                font-family: {{FONT_PRIMARY}}, font-size: 40px
                fill: url(#brandGradient) (for top layer only, {{COLOR_CAPTION}} for others)

Layer title:    x = layer_left + 100px, y = layer_y + 82px
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}

Layer desc:     x = layer_left + 100px, y = title_y + 32px
                font-family: {{FONT_SECONDARY}}, font-size: 22-24px
                fill: {{COLOR_CAPTION}}
```

### Rules
- **Maximum 3 layers** to maintain spacing and readability
- Verify: last layer bottom (y=1020) stays below y=1050
- Top layer has slightly higher fill-opacity (0.06) to indicate priority
- Each layer must have both a title and description
- Text inside layers with 40px horizontal padding
- Glass containers: `fill="white" fill-opacity="0.04" stroke-opacity="0.1" rx="12"`
- Optional: subtle drop shadow on layers via `<filter>` for depth

---

## FLOW

**Use for**: Processes, timelines, sequential steps, cause-and-effect chains, pipelines.

**Philosophy**: Directional energy moving top to bottom. Clean nodes connected by lines or arrows. The eye should naturally follow the flow.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Flow steps:     from y=420 to y=1000
                3-5 steps connected with arrows/lines

Step boxes:     height: 80px
                width: 300-500px
                centered at x=530
                fill: white, fill-opacity: 0.04, rx: 12

Step 1:         y=420 to y=500
Step 2:         y=560 to y=640
Step 3:         y=700 to y=780
Step 4:         y=840 to y=920 (optional)
Step 5:         y=940 to y=1000 (only if 5 steps, reduce heights)

Labels:         Inside boxes, centered
                font-family: {{FONT_PRIMARY}}, font-size: 24-28px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Arrows:         Simple lines with small arrowheads between boxes
                stroke: url(#brandGradient), stroke-width: 2px
                Arrow from bottom of box N to top of box N+1
```

### Rules
- Maximum 5 steps
- Ensure equal spacing between all steps
- Arrows/connectors must clearly indicate direction (top to bottom)
- One step may be "active" (highlighted with brandGradient stroke, slightly larger)
- Labels must not overlap - reduce font size if needed to maintain spacing
- Verify all step boxes fit within x=140 to x=920 and y=420 to y=1000

---

## RADIANCE

**Use for**: Central concepts with supporting elements, hub-and-spoke models, ecosystem maps, feature highlights around a core idea.

**Philosophy**: A single powerful concept at the center with supporting ideas radiating outward. The center demands attention; the spokes provide context. Like a sun with rays.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Center point:   x=530, y=700

Central element: Circle at center
                 r=60
                 fill: url(#brandGradient)

Central label:  Inside central element
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Maximum radius: 280px (to stay within safe zone)

Radiating items: 4-6 items at equal angles around center
                 Distance from center: 200-280px

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
- Each spoke must stay entirely within the safe zone (x=140-920, y=300-1100)
- The central element should contain the core concept (1-3 words max)
- Center circle: r=60, fill with brandGradient
- Spokes at top/bottom should have labels to the side to avoid overlap with headline/footer
- One spoke may be visually emphasized (brandGradient stroke on its line, bolder label)
- Avoid placing spokes at exact top (12 o'clock) position to prevent headline collision
- Start spoke placement at roughly 2 o'clock and distribute clockwise

---

## THE_SHIFT

**Use for**: Before/after comparisons, transformations, paradigm shifts, old vs. new contrasts.

**Philosophy**: A clear visual divide between two states. The left side represents the old/before, the right side the new/after. The divider creates tension and the eye moves naturally from left to right.

### Spatial Rules
```
Headline:       y=320
                font-size: 56-64px ({{FONT_PRIMARY}})

Vertical divider: x=530, from y=400 to y=1050
                  stroke: {{COLOR_TEXT}}, stroke-opacity: 0.15, stroke-width: 1px

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
- All content must stay within y=400 to y=1050

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
