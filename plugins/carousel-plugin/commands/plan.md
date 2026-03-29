---
name: carousel:plan
description: Plan carousel content — preview a single carousel strategy before generating, or plan a multi-carousel editorial series around a theme.
argument-hint: "your topic or theme"
---

# Carousel Planning

This command has two modes based on input:

## Mode Detection

- If the user gives a **specific topic** (e.g., "5 tips for better sleep") → **Single Carousel Strategy Preview**
- If the user gives a **theme or series** (e.g., "AI productivity content for this week", "4 carousels about fitness") → **Editorial Series Plan**
- If unclear, ask: "Are you planning a single carousel or a content series?"

---

## Mode 1: Single Carousel Strategy Preview

Preview the content strategy BEFORE spending API credits on SVG generation. The user can approve, tweak, or reject before proceeding to `/carousel:generate`.

### Step 1: Read Brand Profile

Read `brand-profile.json` from project root. If not found, tell user to run `/carousel:setup` first.

### Step 2: Generate Strategy (Opus via OpenRouter)

Call OpenRouter with the strategy prompt (same as `/carousel:generate` Step 1):

WebFetch POST to `https://openrouter.ai/api/v1/chat/completions`:
```json
{
  "model": "anthropic/claude-opus-4",
  "messages": [
    {
      "role": "system",
      "content": "[Load and fill strategy-system.md prompt with brand values]"
    },
    {
      "role": "user",
      "content": "Create a carousel strategy for: {topic}\n\nDetails: {details}"
    }
  ],
  "temperature": 0.3,
  "max_tokens": 4000
}
```

### Step 3: Present Strategy for Review

Display the strategy in a clear, scannable format:

```
## Carousel Plan: {topic}

**Narrative arc:** {narrative_arc}
**Target outcome:** {target_outcome}
**Slides:** {count}

| # | Framework | Headline | Key Data |
|---|-----------|----------|----------|
| 1 | hero | "..." | ... |
| 2 | bar_chart | "..." | ... |
| 3 | quadrant | "..." | ... |
| ... | ... | ... | ... |

### Slide Details

**Slide 1 (Hero)**
- Headline: "..."
- Layout: centered_void
- Gradient keyword: "..."

**Slide 2 (Bar Chart)**
- Headline: "..."
- Data points: [...]
- Layout: asymmetric_tension

[etc.]
```

### Step 4: Get User Feedback

Ask: "How does this look? You can:"
- **Approve** → "Run `/carousel:generate` to create the visuals"
- **Tweak** → User says what to change (e.g., "swap slide 3 to a flow diagram", "make the headlines shorter")
  - Re-generate strategy with modifications and show again
- **Reject** → Start over with a different angle

### Step 5: Save Approved Strategy

When approved, save to `./carousels/plans/{date}-{slug}-plan.json` so `/carousel:generate` can optionally pick it up and skip the strategy phase (saving one API call).

---

## Mode 2: Editorial Series Plan

Plan multiple carousels around a theme for batch content creation.

### Step 1: Understand the Series

Ask clarifying questions ONE AT A TIME:
1. "What's the overarching theme?" (if not already clear from input)
2. "How many carousels do you want to plan?" (default: 3-5)
3. "Any specific angles or subtopics you want covered?"
4. "What's the posting cadence?" (e.g., daily, 3x/week) — optional, for scheduling context

### Step 2: Generate Series Plan (Opus via OpenRouter)

Call OpenRouter:
```json
{
  "model": "anthropic/claude-opus-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a content strategist planning a carousel series for {brand_name}. Brand: {brand_description}. Audience: {audience}. Tone: {tone}. Industry: {industry}.\n\nPlan a series of {count} carousels around the theme below. Each carousel should have a unique angle that builds on the series narrative. Avoid repetition across carousels.\n\nRespond with JSON:\n{\n  \"series_title\": \"...\",\n  \"series_narrative\": \"how the carousels connect\",\n  \"carousels\": [\n    {\n      \"number\": 1,\n      \"topic\": \"specific carousel topic\",\n      \"angle\": \"unique angle/hook\",\n      \"slide_count\": 5,\n      \"key_frameworks\": [\"hero\", \"data_table\", \"flow\"],\n      \"hook\": \"opening hook for slide 1\",\n      \"target_takeaway\": \"what the audience learns\"\n    }\n  ]\n}"
    },
    {
      "role": "user",
      "content": "Plan a carousel series about: {theme}\n\nSubtopics to cover: {subtopics}\nNumber of carousels: {count}"
    }
  ],
  "temperature": 0.4,
  "max_tokens": 4000
}
```

### Step 3: Present Series Plan

Display in a clear format:

```
## Content Series: {series_title}

**Theme:** {theme}
**Narrative:** {series_narrative}
**Carousels:** {count}

### Carousel 1: {topic}
- **Angle:** {angle}
- **Hook:** "{hook}"
- **Frameworks:** hero → data_table → flow → stack → hero
- **Takeaway:** {target_takeaway}

### Carousel 2: {topic}
- **Angle:** {angle}
- **Hook:** "{hook}"
- **Frameworks:** hero → quadrant → bar_chart → flow → hero
- **Takeaway:** {target_takeaway}

[etc.]
```

### Step 4: User Picks Which to Generate

Ask: "Which carousels do you want to generate? (e.g., 'all', '1 and 3', 'just the first one')"

For each selected carousel:
- Run `/carousel:plan` in Mode 1 (single strategy preview) for that specific topic
- After approval, run `/carousel:generate`
- Or save all plans to `./carousels/plans/` for later generation

### Step 5: Save Series Plan

Save to `./carousels/plans/{date}-series-{slug}.json` with all carousel plans for reference.

---

## Plan File Format

Saved plans follow this structure so `/carousel:generate` can consume them:

```json
{
  "planned_at": "2026-03-29T20:00:00Z",
  "topic": "...",
  "brand_name": "...",
  "status": "approved",
  "strategy": {
    "topic": "...",
    "narrative_arc": "...",
    "target_outcome": "...",
    "slides": [...]
  }
}
```

When `/carousel:generate` is run, check `./carousels/plans/` for a recent approved plan matching the topic. If found, ask: "Found an approved plan for this topic. Use it? (saves one API call)" — if yes, skip strategy generation and go straight to SVG rendering.
