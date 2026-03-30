---
name: carousel:export
description: Export your carousel slides to PNG or PDF. Uses Playwright to render SVGs at high resolution.
argument-hint: "[--png | --pdf] [--dpi 300]"
---

# Carousel Export

Export the most recent carousel to PNG or PDF format for easy sharing.

## Find Latest Carousel

1. Look in `./carousels/` for the most recent directory (by date prefix)
2. Glob for all `slide-*.svg` files (not .raw-slide-*)
3. Sort by slide number

If no carousel found, tell user to run `/carousel:generate` first.

## Parse Options

- `--png` (default): Export each slide as a PNG image
- `--pdf`: Export all slides as a single multi-page PDF
- `--dpi 150` or `--dpi 300`: Set resolution (default: 150 for screen, 300 for print)

## PNG Export

For each `slide-{N}.svg`:

1. Read `brand-profile.json` to get canvas dimensions (width, height)
2. Calculate pixel dimensions: width × (dpi/72), height × (dpi/72)
3. Start a local HTTP server for the SVG files (Playwright can't open file:// URLs):
   ```bash
   cd {carousel_dir} && python3 -m http.server 8765 &
   ```
4. Use Playwright MCP tools:
   - `browser_resize` to set viewport to canvas dimensions
   - `browser_navigate` to `http://localhost:8765/slide-{N}.svg`
   - Wait for fonts to load (1-2 seconds)
   - `browser_take_screenshot` and save to `slide-{N}.png`
5. Kill the HTTP server when done

Report: "Exported {N} slides to PNG ({dpi} DPI)"
- List all PNG file paths

## PDF Export

1. Generate PNGs first (same process as above)
2. Create an HTML page that lays out all PNGs as a print-optimized document:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       @page { size: {width}px {height}px; margin: 0; }
       body { margin: 0; }
       img { width: 100%; height: 100%; page-break-after: always; object-fit: contain; }
       img:last-child { page-break-after: avoid; }
     </style>
   </head>
   <body>
     {for each slide: <img src="slide-{N}.png"/>}
   </body>
   </html>
   ```
3. Use Playwright to print this page to PDF:
   - `browser_navigate` to the HTML page
   - Use `browser_run_code` with: `await page.pdf({ path: 'carousel.pdf', printBackground: true })`

Report: "Exported carousel to PDF: {path}"

## Cleanup

- Kill the HTTP server process
- Keep the PNG files (useful for social media posting)
- The PDF is saved alongside the SVGs

## Output Structure

After export:
```
./carousels/2026-03-30-topic/
├── slide-1.svg (original)
├── slide-1.png (exported)
├── slide-2.svg
├── slide-2.png
├── ...
└── carousel.pdf (if --pdf)
```
