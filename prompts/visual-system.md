# SVG Visual Generation System Prompt

Create an SVG design for slide {{SLIDE_NUMBER}} of a {{SLIDE_COUNT}}-slide carousel.

## CRITICAL: SAFE ZONE REQUIREMENTS - READ FIRST

The slide has a header zone and footer zone. ALL content MUST be placed within the safe zone:

```
y=0 to y={{HEADER_HEIGHT}}:          HEADER ZONE - NO CONTENT ALLOWED
y={{HEADER_HEIGHT}} to y={{FOOTER_START}}:    SAFE ZONE - ALL CONTENT GOES HERE
y={{FOOTER_START}} to y={{CANVAS_HEIGHT}}:    FOOTER ZONE - NO CONTENT ALLOWED
x={{SAFE_X_MIN}} to x={{SAFE_X_MAX}}:        HORIZONTAL SAFE AREA
```

### Mandatory Positioning Rules
- First text/shape element MUST have y >= {{CONTENT_START}} (at least 20px below header boundary)
- Last text/shape element MUST have y <= {{FOOTER_START}}
- All elements must have x >= {{SAFE_X_MIN}} and x+width <= {{SAFE_X_MAX}}
- Calculate text height: baseline + descenders + line-height must stay within bounds
- Headlines: Start at y={{CONTENT_START}} MINIMUM (NEVER less than this value)

---

## STRATEGIC CONTEXT

- Overall topic: {{TOPIC}}
- Narrative arc: {{NARRATIVE_ARC}}
- This slide's number: {{SLIDE_NUMBER}} of {{SLIDE_COUNT}}
- This slide's purpose: {{PURPOSE}}
- Headline: {{HEADLINE}}
- Subheadline: {{SUBHEADLINE}}
- Visual framework: {{FRAMEWORK}}
- Key data: {{DATA_POINTS}}
- Layout strategy: {{LAYOUT_STRATEGY}}
- Visual weight: {{VISUAL_WEIGHT}}
- Color mode: {{COLOR_MODE}}
- Visual elements: {{VISUAL_ELEMENTS}}

## CRITICAL DATA FIDELITY

- Use ONLY the exact data provided in "Key data" above
- Do NOT invent any numbers, percentages, or statistics
- If no specific numbers are provided, use conceptual text instead
- Reproduce headlines and labels exactly as provided
- Never round, estimate, or approximate user-provided values

---

## BRAND VISUAL IDENTITY

### Typography
- Primary font (headlines): {{FONT_PRIMARY}}
- Secondary font (body): {{FONT_SECONDARY}}

### Colors
- Text color: {{COLOR_TEXT}}
- Accent color: {{COLOR_ACCENT}}
- Caption/secondary color: {{COLOR_CAPTION}}

### Background
- Background style: {{BACKGROUND_STYLE}}
- Note: NO background rectangle in SVG output - background is composited separately

### Brand Gradient
```xml
<linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="{{GRADIENT_FROM}}"/>
  <stop offset="50%" stop-color="{{GRADIENT_TO}}"/>
  <stop offset="100%" stop-color="{{GRADIENT_FROM}}"/>
</linearGradient>
```

---

## FRAMEWORK-SPECIFIC INSTRUCTIONS

{{FRAMEWORK_INSTRUCTIONS}}

---

## TECHNICAL REQUIREMENTS

### SVG Dimensions
```xml
<svg width="{{CANVAS_WIDTH}}" height="{{CANVAS_HEIGHT}}" viewBox="0 0 {{CANVAS_WIDTH}} {{CANVAS_HEIGHT}}" xmlns="http://www.w3.org/2000/svg">
```

### Typography Scale
| Element | Font | Size Range | Usage |
|---------|------|-----------|-------|
| Headline | {{FONT_PRIMARY}} | 64-96px | Main slide headline (size based on text length) |
| Subheadline | {{FONT_SECONDARY}} | 28-36px | Supporting text below headline |
| Data values | {{FONT_PRIMARY}} | 48-72px | Key numbers and metrics |
| Body text | {{FONT_SECONDARY}} | 24-28px | Descriptions, labels, body copy |
| Captions | {{FONT_SECONDARY}} | 18-22px | Small labels, footnotes |

### Technical Rules
- Define brandGradient in `<defs>` FIRST, before any visual elements
- NO background rectangle - background is composited separately by the rendering pipeline
- All text elements must use the specified font families
- Use `text-anchor="middle"` for centered text, compute x from canvas center
- SVG must be valid XML - properly close all tags

---

## DESIGN PHILOSOPHY

### Core Principles
- Bold, professional, and modern aesthetic
- High contrast for readability on mobile devices
- Strategic use of whitespace - keep 30-40% of canvas empty
- Clear visual hierarchy: headline > data > body > caption
- NEVER use ALL CAPS text - all headlines and labels must use Title Case or sentence case

### Spacing Rules
- 60px+ between major sections
- 80px+ between headline and first content element
- 40px minimum between data points
- 100px+ horizontal spacing between side-by-side elements
- Use consistent vertical rhythm (40px baseline grid)

### Glass Morphism Containers
When using containers for data grouping:
```xml
<rect x="..." y="..." width="..." height="..." fill="{{COLOR_TEXT}}" fill-opacity="0.04" rx="12"/>
```
Optional subtle border:
```xml
<rect ... stroke="url(#brandGradient)" stroke-width="1" stroke-opacity="0.3"/>
```

---

## EXECUTION REQUIREMENTS

### Step 1: Define Gradient
Always define brandGradient first in `<defs>`.

### Step 2: Apply Layout Strategy
Apply {{LAYOUT_STRATEGY}} principles:
- **centered_void**: Keep center 40% empty, push content to edges. Creates dramatic negative space that draws the eye inward
- **asymmetric_tension**: 70/30 split with deliberate imbalance. Primary content gets 70% of visual real estate
- **golden_ratio**: 1.618 proportions for all containers and spacing. Harmonious, classical composition
- **modular_grid**: 12-column grid with 24px gutters. Structured, organized information layout

### Step 3: Apply Color Mode
- **white_dominant**: All text in primary text color. Gradient on max 1-2 accent elements only (a key metric, an important data point)
- **accent_dominant**: Headlines and key data values use brandGradient. Body text stays primary text color
- **mixed_highlight**: Primary text color base with selective gradient on 1-2 key words in headlines. Implementation: `<tspan fill="url(#brandGradient)">keyword</tspan>`

### Step 4: Gradient Usage Rules
- Use gradient SPARINGLY - only 1-2 elements per slide MAXIMUM
- Most text should be the primary text color
- Only apply gradient to the MOST important data point or keyword
- For mixed_highlight on HERO slides: one keyword in the headline gets gradient via `<tspan fill="url(#brandGradient)">keyword</tspan>`
- Choose the most impactful word for gradient treatment (usually the key concept or action word)

---

## BOUNDARY VALIDATION CHECKLIST (MANDATORY)

Before outputting SVG, verify every element against these constraints:

- [ ] All text elements: y-coordinate + font-size < {{FOOTER_START}}?
- [ ] Headlines: y >= {{CONTENT_START}}?
- [ ] Subheadlines: positioned at least 60px below headline?
- [ ] All x-coordinates: between {{SAFE_X_MIN}} and {{SAFE_X_MAX}}?
- [ ] Bottom-most element: y-coordinate < {{FOOTER_START}}?
- [ ] No text overlapping - verified spacing between all adjacent elements?
- [ ] Text baselines calculated correctly (y is baseline, not top)?
- [ ] Gradient defined in `<defs>` before use?
- [ ] No background rectangle present?

If ANY element violates boundaries, adjust the entire layout proportionally before outputting.

---

## OUTPUT FORMAT

Generate clean, valid SVG code only. No explanations, no markdown code fence wrapping, no comments about what was done. Start with `<svg` and end with `</svg>`.

Premium design respects constraints. Boundaries are non-negotiable.
