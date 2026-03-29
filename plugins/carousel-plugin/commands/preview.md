---
name: carousel:preview
description: Preview your most recent carousel in the browser. Opens all slides in a visual layout.
---

# Carousel Preview

## Find Latest Carousel

1. Look in `./carousels/` for the most recent directory (by date prefix)
2. Glob for all `slide-*.svg` files in that directory
3. Sort by slide number

If no carousel found, tell user to run `/carousel:generate` first.

## Generate Preview HTML

Create a temporary HTML file at `./carousels/.preview.html` with this structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Carousel Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0a0a0a;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #fff;
    }
    .subtitle {
      color: #666;
      font-size: 14px;
      margin-bottom: 40px;
    }
    .carousel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1400px;
    }
    .slide-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }
    .slide-card:hover {
      transform: translateY(-4px);
      border-color: #444;
    }
    .slide-card img {
      width: 100%;
      height: auto;
      display: block;
    }
    .slide-label {
      padding: 12px 16px;
      font-size: 13px;
      color: #888;
      border-top: 1px solid #222;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #1a1a1a;
      color: #444;
      font-size: 12px;
    }
    .footer a { color: #666; text-decoration: none; }
  </style>
</head>
<body>
  <h1>{carousel_title}</h1>
  <p class="subtitle">{slide_count} slides · Generated {date}</p>
  <div class="carousel-grid">
    {for each slide: <div class="slide-card"><img src="slide-{N}.svg" alt="Slide {N}"><div class="slide-label">Slide {N}</div></div>}
  </div>
  <div class="footer">
    Built with <a href="https://github.com/nodeagencyai/Carousel-plugin-claude">Carousel Generator</a> for Claude Code
  </div>
</body>
</html>
```

## Open in Browser

Use the Playwright MCP tools to preview:
1. `browser_navigate` to the file URL: `file://{absolute_path_to_preview.html}`
2. Optionally take a screenshot with `browser_take_screenshot` and show it to the user

Report: "Preview opened in browser. {N} slides displayed."
