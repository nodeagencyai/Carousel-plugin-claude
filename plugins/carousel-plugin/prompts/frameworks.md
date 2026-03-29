# Visual Framework Definitions

This file contains the spatial rules and layout instructions for each carousel visual framework. These are injected into the visual generation prompt as `{{FRAMEWORK_INSTRUCTIONS}}` based on the strategy's chosen framework for each slide.

All frameworks operate within the safe zone defined by:
- **Top boundary**: y={{CONTENT_START}} (first content element)
- **Bottom boundary**: y={{FOOTER_START}} (nothing below this)
- **Left boundary**: x={{SAFE_X_MIN}}
- **Right boundary**: x={{SAFE_X_MAX}}
- **Canvas center X**: midpoint of {{SAFE_X_MIN}} and {{SAFE_X_MAX}}
- **Canvas center Y**: midpoint of {{CONTENT_START}} and {{FOOTER_START}}

---

## HERO

**Use for**: Opening slides, powerful statements, brand impact moments.

**Philosophy**: Minimal. Think Apple keynote opening slide. The power comes from what you leave out, not what you put in. Maximum 60% of the canvas should be empty space.

### Spatial Rules
```
Headline:       y = canvas_center_y (vertically centered in safe zone)
                font-size: 84-96px ({{FONT_PRIMARY}})
                text-anchor: middle, x = canvas_center_x

Gradient word:  MANDATORY - one keyword MUST use brand gradient
                <tspan fill="url(#brandGradient)">keyword</tspan>
                Choose the most impactful word (key concept or action word)
                DO NOT make entire headline gradient - ONLY one word

Subtitle:       y = headline_y + 80px
                font-size: 32-36px ({{FONT_SECONDARY}})
                fill: {{COLOR_CAPTION}}
                Optional - only if subheadline is provided

Accent line:    Optional subtle decorative line below headline
                width: 150-200px, centered, stroke: url(#brandGradient), 2-3px
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
<text x="{{center_x}}" y="{{center_y}}" text-anchor="middle"
      font-family="{{FONT_PRIMARY}}" font-size="84" fill="{{COLOR_TEXT}}">
  The Future is <tspan fill="url(#brandGradient)">Autonomous</tspan>
</text>
<text x="{{center_x}}" y="{{center_y + 80}}" text-anchor="middle"
      font-family="{{FONT_SECONDARY}}" font-size="32" fill="{{COLOR_CAPTION}}">
  Why the next decade belongs to AI-native companies
</text>
```

---

## DATA_TABLE

**Use for**: Structured comparisons, feature lists, specifications, side-by-side data.

**Philosophy**: Clean, scannable information. The table should feel like a premium financial report, not a spreadsheet. Generous row height, subtle separators, typographic hierarchy.

### Spatial Rules
```
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})
                text-anchor: middle, x = canvas_center_x

Subtitle:       y = headline_y + 60px
                font-size: 28px ({{FONT_SECONDARY}})
                fill: {{COLOR_CAPTION}}

Table start:    y = subtitle_y + 80px (or headline_y + 100px if no subtitle)

Column headers: font-family: {{FONT_PRIMARY}}, font-size: 22-24px
                fill: {{COLOR_CAPTION}}

Data rows:      font-family: {{FONT_SECONDARY}}, font-size: 26-28px
                fill: {{COLOR_TEXT}}
                Row height: 70-80px

Row separators: Horizontal lines, stroke: {{COLOR_TEXT}}, stroke-opacity: 0.08, 0.5px

Table width:    Max 700px, centered horizontally
                Left edge: canvas_center_x - 350
                Right edge: canvas_center_x + 350

Row backgrounds: Alternating fill-opacity (0.02 and 0.04) for subtle striping
```

### Rules
- Maximum 6 rows to maintain readability
- Maximum 3 columns to prevent crowding
- One key value per row may use brandGradient fill
- Cell padding: 30px horizontal, centered vertically in row
- Header row gets a slightly stronger background (fill-opacity: 0.06)
- Last row must end before {{FOOTER_START}} - calculate total height before rendering

---

## BAR_CHART

**Use for**: Quantitative comparisons, rankings, performance metrics. ONLY use when user provided actual comparable numerical values.

**Philosophy**: Thin, elegant horizontal bars. Not Excel charts - think editorial data visualization. The bars should feel effortless, like they belong in a design magazine.

### Spatial Rules
```
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})

Subtitle:       y = headline_y + 60px (optional)

EXACT POSITIONING FORMULA (max 4 bars):
Bar spacing:    180-200px between each bar group

Bar 1:          Label y = headline_y + 160px
                Bar y = label_y + 30px

Bar 2:          Label y = bar_1_y + 180px
                Bar y = label_y + 30px

Bar 3:          Label y = bar_2_y + 180px
                Bar y = label_y + 30px

Bar 4:          Label y = bar_3_y + 180px (only if fits before {{FOOTER_START}})
                Bar y = label_y + 30px

BAR SPECIFICATIONS:
- Bar height: 30px (thin and elegant)
- Bar max width: 400px (scaled proportionally to values)
- Background track: same position, width: 500px, fill: {{COLOR_TEXT}}, fill-opacity: 0.06, rx: 4
- Actual bar: fill: {{COLOR_TEXT}}, fill-opacity: 0.9, rx: 4
- All bars start at x = {{SAFE_X_MIN}}

Labels:         x = {{SAFE_X_MIN}}, y = bar_y - 20px
                font-family: {{FONT_SECONDARY}}, font-size: 24px
                fill: {{COLOR_CAPTION}}

Values:         x = {{SAFE_X_MIN}} + 520px, y = bar_y + 15px
                font-family: {{FONT_PRIMARY}}, font-size: 36-40px
                fill: url(#brandGradient) for the highest value, {{COLOR_TEXT}} for others
```

### Rules
- Maximum 4 bars to maintain spacing
- Labels ALWAYS above bars, values ALWAYS to the right - NO overlap
- DO NOT place values inside bars
- DO NOT use computed y-offset calculations - use EXACT y coordinates
- DO NOT make bars taller than 30px
- The largest value gets brandGradient treatment
- Verify: last bar_y + 30px < {{FOOTER_START}}

---

## QUADRANT

**Use for**: 2x2 matrices, comparing items along two dimensions, strategic positioning maps.

**Philosophy**: Clean intersecting lines create four distinct zones. Each quadrant tells part of the story. The intersection point is the visual anchor.

### Spatial Rules
```
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})

Intersection:   x = canvas_center_x, y = midpoint of (headline_y + 100) and ({{FOOTER_START}} - 60)

Hairlines:      Horizontal: x={{SAFE_X_MIN}} to x={{SAFE_X_MAX}}, y=intersection_y
                Vertical: x=intersection_x, y=headline_y+80 to y={{FOOTER_START}}-60
                stroke: {{COLOR_TEXT}}, stroke-opacity: 0.15, stroke-width: 1px

Axis labels:    font-family: {{FONT_SECONDARY}}, font-size: 18-20px
                fill: {{COLOR_CAPTION}}, positioned at line endpoints

Quadrant labels: Centered within each quadrant
                 font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                 fill: {{COLOR_TEXT}}

Quadrant data:   font-family: {{FONT_SECONDARY}}, font-size: 22-24px
                 fill: {{COLOR_CAPTION}}
                 Positioned below quadrant label with 30px gap

Quadrant zones:
  Top-left:     x={{SAFE_X_MIN}}+20 to intersection_x-20, y=headline_y+80 to intersection_y-20
  Top-right:    intersection_x+20 to {{SAFE_X_MAX}}-20, y=headline_y+80 to intersection_y-20
  Bottom-left:  x={{SAFE_X_MIN}}+20 to intersection_x-20, y=intersection_y+20 to {{FOOTER_START}}-60
  Bottom-right: intersection_x+20 to {{SAFE_X_MAX}}-20, y=intersection_y+20 to {{FOOTER_START}}-60
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
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})

Subtitle:       y = headline_y + 60px (optional)

Stack start:    y = headline_y + 140px (or + 100px if no subtitle)

LAYER SPECIFICATIONS:
- Maximum 4 layers (3 is optimal)
- Layer height: 140-180px
- Gap between layers: 30-40px
- Layer width: 80% of safe zone width
- Layers centered horizontally

Layer 1:        y = stack_start
Layer 2:        y = layer_1_y + layer_height + gap
Layer 3:        y = layer_2_y + layer_height + gap
Layer 4:        y = layer_3_y + layer_height + gap (only if fits)

Layer container: <rect x="..." y="..." width="..." height="..."
                  fill="{{COLOR_TEXT}}" fill-opacity="0.04" rx="12"
                  stroke="{{COLOR_TEXT}}" stroke-opacity="0.08" stroke-width="1"/>

Layer number:   x = layer_left + 40px, y = layer_y + (height/2) + 8px
                font-family: {{FONT_PRIMARY}}, font-size: 40px
                fill: url(#brandGradient) (for top layer only, {{COLOR_CAPTION}} for others)

Layer title:    x = layer_left + 100px, y = layer_y + (height/2) - 8px
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}

Layer desc:     x = layer_left + 100px, y = title_y + 32px
                font-family: {{FONT_SECONDARY}}, font-size: 22-24px
                fill: {{COLOR_CAPTION}}
```

### Rules
- Verify: last layer_y + layer_height < {{FOOTER_START}}
- Top layer can have slightly higher fill-opacity (0.06) to indicate priority
- Each layer must have both a title and description
- Text inside layers with 40px horizontal padding
- Optional: subtle drop shadow on layers via `<filter>` for depth

---

## FLOW

**Use for**: Processes, timelines, sequential steps, cause-and-effect chains, pipelines.

**Philosophy**: Directional energy moving left to right (or top to bottom for vertical flows). Clean nodes connected by lines or arrows. The eye should naturally follow the flow.

### Spatial Rules
```
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})

HORIZONTAL FLOW (default for 3-5 nodes):
Flow line:      y = vertical center of safe zone
                x = {{SAFE_X_MIN}} + 40 to {{SAFE_X_MAX}} - 40
                stroke: url(#brandGradient), stroke-width: 2px

Nodes:          Evenly spaced along flow line
                Circle diameter: 40-50px
                fill: {{COLOR_TEXT}}, fill-opacity: 0.08
                stroke: url(#brandGradient), stroke-width: 1.5px

Node labels:    Above nodes, y = flow_y - 60px
                font-family: {{FONT_PRIMARY}}, font-size: 24-28px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Node details:   Below nodes, y = flow_y + 60px
                font-family: {{FONT_SECONDARY}}, font-size: 20-22px
                fill: {{COLOR_CAPTION}}, text-anchor: middle
                Max width: node_spacing - 40px (use word wrap)

Arrows:         Small chevrons (>) between nodes
                fill: url(#brandGradient), font-size: 24px

VERTICAL FLOW (for 4+ detailed steps):
Flow line:      x = {{SAFE_X_MIN}} + 60
                y = headline_y + 100 to {{FOOTER_START}} - 40

Nodes:          Evenly spaced vertically along line

Step labels:    x = flow_x + 50, y = node_y
                font-family: {{FONT_PRIMARY}}, font-size: 26-28px

Step details:   x = flow_x + 50, y = node_y + 30px
                font-family: {{FONT_SECONDARY}}, font-size: 22px
```

### Rules
- Maximum 5 nodes for horizontal, 6 for vertical
- Ensure equal spacing between all nodes
- Arrows/connectors must clearly indicate direction
- One node may be "active" (highlighted with brandGradient fill, slightly larger)
- Labels must not overlap - reduce font size if needed to maintain spacing
- Verify all node labels fit within {{SAFE_X_MIN}} to {{SAFE_X_MAX}}

---

## RADIANCE

**Use for**: Central concepts with supporting elements, hub-and-spoke models, ecosystem maps, feature highlights around a core idea.

**Philosophy**: A single powerful concept at the center with supporting ideas radiating outward. The center demands attention; the spokes provide context. Like a sun with rays.

### Spatial Rules
```
Headline:       y = {{CONTENT_START}}
                font-size: 56-64px ({{FONT_PRIMARY}})

Center point:   x = canvas_center_x
                y = midpoint of (headline_y + 100) and ({{FOOTER_START}} - 60)

Central element: Circle or rounded rect at center
                 radius: 60-80px
                 fill: {{COLOR_TEXT}}, fill-opacity: 0.06
                 stroke: url(#brandGradient), stroke-width: 2px

Central label:  Inside central element
                font-family: {{FONT_PRIMARY}}, font-size: 28-32px
                fill: {{COLOR_TEXT}}, text-anchor: middle

Radiating lines: From center outward to spoke positions
                 stroke: {{COLOR_TEXT}}, stroke-opacity: 0.12
                 stroke-width: 1px
                 Maximum radius: calculated to stay within safe zone bounds

Spoke positions: Evenly distributed around center at 360/N degree intervals
                 Distance from center: 200-280px (must stay in safe zone)

                 Calculate max radius per spoke:
                 - Horizontal clearance: min(center_x - {{SAFE_X_MIN}}, {{SAFE_X_MAX}} - center_x) - 80px
                 - Vertical clearance up: center_y - (headline_y + 80) - 40px
                 - Vertical clearance down: {{FOOTER_START}} - center_y - 40px
                 - Use the minimum of all clearances as max radius

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
- Each spoke must stay entirely within the safe zone - calculate positions before rendering
- The central element should contain the core concept (1-3 words max)
- Spokes at top/bottom should have labels to the side to avoid overlap with headline/footer
- One spoke may be visually emphasized (brandGradient stroke on its line, bolder label)
- Avoid placing spokes at exact top (12 o'clock) position to prevent headline collision
- Start spoke placement at roughly 2 o'clock and distribute clockwise

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
