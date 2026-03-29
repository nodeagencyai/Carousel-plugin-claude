# Brand Setup Wizard

This document defines the conversational flow for setting up a brand profile. The wizard collects visual identity, content preferences, and brand DNA to generate a `brand-profile.json` that drives all carousel generation.

---

## Pre-Stage: Website Auto-Detection (Optional)

Before starting the manual wizard, offer to scan a website URL for automatic detection of brand attributes.

### Prompt
```
Would you like me to scan your website to auto-detect your brand colors, fonts, and tone?

Paste your website URL (or type "skip" to set up manually):
```

### If URL Provided
Scan the website and attempt to extract:
- **Primary colors**: from CSS custom properties, dominant header/button colors
- **Background style**: dark vs light mode, textures, gradients
- **Typography**: font-family declarations from headings and body text
- **Tone indicators**: analyze hero copy, about page, and CTA language for formality level
- **Logo**: detect primary logo image URL
- **Industry signals**: from meta description, page content, structured data

Present findings for confirmation:
```
Here's what I detected from {{URL}}:

Colors:
  - Primary text: {{detected_text_color}}
  - Accent: {{detected_accent_color}}
  - Background: {{detected_bg_style}}

Typography:
  - Headlines: {{detected_heading_font}}
  - Body: {{detected_body_font}}

Tone: {{detected_tone}} ({{tone_evidence}})

Does this look right? I'll use these as defaults — you can override anything in the setup below.
```

Then proceed through the stages below, pre-filling detected values as defaults.

---

## Stage 1: Visual Identity

Collect the core visual properties that define how carousels will look.

### Questions

**1.1 Brand Name**
```
What is your brand or company name?
```
- Required
- Used in strategy prompts and optionally in slide footers

**1.2 Logo**
```
Do you have a logo image you'd like to include on slides?

Options:
a) Upload a logo file (PNG or SVG with transparent background recommended)
b) Provide a URL to your logo
c) No logo — text-only branding
```
- Optional
- If provided: stored as `logo_path` or `logo_url`
- Logo placement zone is in the header area (above safe zone)

**1.3 Color Palette**
```
Let's set up your color palette. I need these colors (hex codes preferred):

1. Primary text color (what color is most of your text?)
   Default: #FFFFFF (white — best for dark backgrounds)

2. Accent color (your brand highlight color — used sparingly on key words/data)
   Example: #3B82F6 (blue), #10B981 (green), #F59E0B (amber)

3. Caption/secondary text color (for less prominent text)
   Default: #999999 (medium gray)

4. Gradient colors (the eye-catching gradient applied to key metrics):
   - Gradient start color:
   - Gradient end color:
   Example: #666666 to #FFFFFF (silver), #3B82F6 to #60A5FA (blue glow)
```
- Text color, accent, and gradient are required
- Caption defaults to a muted version of text color if not provided

**1.4 Background Style**
```
What background style do you want for your carousels?

a) Solid dark (e.g., #000000, #0A0A0A, #1A1A2E)
b) Solid light (e.g., #FFFFFF, #F5F5F5, #FFFBEB)
c) Custom gradient background (provide two colors)
d) Image background (upload a PNG/JPG — will be used for all slides)
e) Separate hero + content backgrounds (different image for slide 1 vs rest)

Enter your choice and color/file:
```
- Determines `background_style` in the profile
- For image backgrounds, images are stored and referenced by path

**1.5 Typography**
```
What fonts should your carousels use?

Primary font (headlines, data values — should be bold/impactful):
  Examples: Inter, Satoshi, Montserrat, Poppins, DM Sans, Plus Jakarta Sans
  Default: Inter

Secondary font (body text, descriptions — should be readable):
  Examples: Inter, Source Sans Pro, DM Sans, Lato
  Default: Same as primary

Note: Use Google Fonts names for best compatibility. Custom fonts can be
provided as .otf/.ttf/.woff2 files.
```
- At minimum, primary font is required
- Secondary defaults to primary if not specified

---

## Stage 2: Content Style

Collect preferences that affect the content strategy and visual framework selection.

### Questions

**2.1 Content Density**
```
How information-dense should your carousels be?

a) Minimal — Big statements, few words, lots of whitespace (think Apple keynotes)
b) Balanced — Mix of narrative and data, moderate whitespace (think consulting decks)
c) Dense — Data-heavy, packed with information (think financial reports)
```
- Maps to `density`: `minimal` | `balanced` | `dense`
- Affects slide count recommendations and data_points per slide

**2.2 Tone**
```
What tone should your carousel copy use?

a) Professional — Polished, authoritative, corporate
b) Conversational — Friendly, approachable, relatable
c) Bold/Provocative — Challenging, contrarian, attention-grabbing
d) Educational — Clear, explanatory, teacher-like
e) Inspirational — Uplifting, motivational, aspirational
f) Custom — Describe your ideal tone:
```
- Maps to `tone` field
- Fed directly into the strategy prompt

**2.3 Preferred Frameworks**
```
Which visual styles do you prefer for your slides? (select all that apply)

a) Hero — Big statement slides with dramatic whitespace
b) Data Table — Clean rows of structured information
c) Bar Chart — Horizontal bars showing comparisons
d) Quadrant — 2x2 matrices for strategic comparisons
e) Stack — Layered glass panels showing hierarchy
f) Flow — Process diagrams with directional movement
g) Radiance — Central concept with radiating elements
h) All of the above — Let AI choose the best fit each time

Which frameworks should be AVOIDED? (optional)
```
- Maps to `preferred_frameworks[]` and `excluded_frameworks[]`
- Strategy prompt will favor/avoid these when selecting per-slide frameworks

**2.4 Default Slide Count**
```
How many slides do you typically want per carousel?

a) 3 — Quick, punchy carousels
b) 5 — Standard format (recommended for most use cases)
c) 7 — Detailed deep-dives
d) 10 — Comprehensive presentations
e) Auto — Let AI determine the optimal count based on content
```
- Maps to `default_slide_count`

---

## Stage 3: Brand DNA

Collect deeper brand context that helps the AI write better copy and make strategic decisions.

### Questions

**3.1 Brand Description**
```
Describe your brand in 1-2 sentences. What do you do and what makes you different?

Example: "We're a B2B SaaS platform that helps e-commerce brands automate their
supply chain. Our differentiator is real-time demand forecasting powered by AI."
```
- Maps to `description`
- Used as context in strategy prompts

**3.2 Industry**
```
What industry or niche are you in?

Examples: SaaS, E-commerce, Fintech, Healthcare, Education, Agency, Creator Economy,
AI/ML, Real Estate, Consulting, DTC Brand, B2B Services
```
- Maps to `industry`
- Influences terminology and data framing in strategy

**3.3 Target Audience**
```
Who is your primary audience for these carousels?

Examples:
- "Startup founders and CTOs at Series A-C companies"
- "Marketing managers at mid-market B2B companies"
- "Solo creators and freelancers building personal brands"
- "Enterprise procurement teams evaluating vendors"
```
- Maps to `audience`
- Critically affects headline style, data complexity, and CTA approach

**3.4 Voice Guidelines**
```
Any specific voice guidelines? How should copy sound?

Examples:
- "Confident but not arrogant. Data-driven. No buzzwords."
- "Casual and witty. Use analogies. Okay to be slightly irreverent."
- "Authoritative and precise. Use industry terminology. Formal."
- "Simple and clear. Avoid jargon. Speak like a human, not a brand."

Or type "skip" to let me infer from your tone selection.
```
- Maps to `voice_guidelines`
- If skipped, generated from tone + industry combination

**3.5 CTA Preferences**
```
What call-to-action style do you prefer for your final slide?

a) Direct CTA — "Book a demo", "Start free trial", "Visit website"
b) Engagement CTA — "Save this post", "Share with someone who needs this", "Comment your thoughts"
c) Soft CTA — "Learn more at...", "Follow for more insights"
d) Question CTA — End with a provocative question to drive comments
e) No CTA — End with a strong closing statement, no explicit ask

Include your CTA URL or handle if applicable:
```
- Maps to `cta_style` and `cta_details`

---

## Output Schema: brand-profile.json

After completing all stages, generate this JSON file:

```json
{
  "version": "1.0",
  "brand_name": "Acme Corp",
  "description": "B2B SaaS platform for supply chain automation",
  "industry": "SaaS",
  "audience": "Startup founders and CTOs at Series A-C companies",
  "voice_guidelines": "Confident but not arrogant. Data-driven. No buzzwords.",
  "tone": "professional",

  "visual_identity": {
    "logo_path": null,
    "logo_url": null,
    "colors": {
      "text": "#FFFFFF",
      "accent": "#3B82F6",
      "caption": "#999999",
      "gradient_from": "#3B82F6",
      "gradient_to": "#60A5FA"
    },
    "background": {
      "style": "solid_dark",
      "color": "#0A0A0A",
      "gradient_from": null,
      "gradient_to": null,
      "hero_image": null,
      "content_image": null
    },
    "typography": {
      "primary": "Inter",
      "secondary": "Inter",
      "custom_font_files": []
    }
  },

  "content_preferences": {
    "density": "balanced",
    "default_slide_count": 5,
    "preferred_frameworks": ["hero", "data_table", "bar_chart", "stack", "flow"],
    "excluded_frameworks": [],
    "cta_style": "direct",
    "cta_details": "Book a demo at acme.com/demo"
  },

  "canvas": {
    "width": 1080,
    "height": 1350,
    "header_height": 150,
    "footer_start": 1150,
    "content_start": 280,
    "safe_x_min": 140,
    "safe_x_max": 920
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string | yes | Schema version for future migrations |
| `brand_name` | string | yes | Display name used in prompts |
| `description` | string | yes | 1-2 sentence brand description |
| `industry` | string | yes | Industry/niche for context |
| `audience` | string | yes | Target audience description |
| `voice_guidelines` | string | yes | How copy should sound |
| `tone` | string | yes | One of: professional, conversational, bold, educational, inspirational, custom |
| `visual_identity.colors.text` | hex | yes | Primary text color |
| `visual_identity.colors.accent` | hex | yes | Brand highlight color |
| `visual_identity.colors.caption` | hex | yes | Secondary/muted text color |
| `visual_identity.colors.gradient_from` | hex | yes | Gradient start color |
| `visual_identity.colors.gradient_to` | hex | yes | Gradient end color |
| `visual_identity.background.style` | string | yes | solid_dark, solid_light, gradient, image, split_image |
| `visual_identity.typography.primary` | string | yes | Headline font family name |
| `visual_identity.typography.secondary` | string | yes | Body font family name |
| `content_preferences.density` | string | yes | minimal, balanced, dense |
| `content_preferences.default_slide_count` | number | yes | 3, 5, 7, 10, or 0 for auto |
| `content_preferences.preferred_frameworks` | array | yes | Frameworks to favor |
| `content_preferences.excluded_frameworks` | array | yes | Frameworks to avoid |
| `content_preferences.cta_style` | string | yes | direct, engagement, soft, question, none |
| `canvas.*` | number | yes | Pixel dimensions for safe zone calculation |

### Canvas Defaults

The default canvas values assume a standard Instagram carousel (1080x1350):

| Property | Default | Description |
|---|---|---|
| `width` | 1080 | Canvas width in pixels |
| `height` | 1350 | Canvas height in pixels |
| `header_height` | 150 | Bottom of header/logo zone |
| `footer_start` | 1150 | Top of footer/branding zone |
| `content_start` | 280 | First allowed y-position for content (below header + buffer) |
| `safe_x_min` | 140 | Left content boundary |
| `safe_x_max` | 920 | Right content boundary |

These can be customized for different aspect ratios (e.g., LinkedIn carousels at 1080x1080, or presentation decks at 1920x1080).

---

## Wizard Implementation Notes

### Conversation Flow
1. Ask about website URL first (auto-detection)
2. Walk through stages sequentially, but allow skipping with defaults
3. After each stage, confirm collected values before moving on
4. At the end, present the full profile for review before saving
5. Save to `brand-profile.json` in the project directory

### Editing Existing Profiles
If a `brand-profile.json` already exists, offer to:
- Edit specific fields ("Change my accent color to #10B981")
- Re-run a specific stage ("Let me redo the visual identity section")
- Start from scratch ("Reset and start over")

### Multiple Brands
Support multiple brand profiles by saving as `brand-profile.{brand_name}.json`. The generation command should accept a `--brand` flag to select which profile to use.
