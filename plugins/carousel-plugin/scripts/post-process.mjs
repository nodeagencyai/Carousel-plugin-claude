#!/usr/bin/env node

/**
 * post-process.mjs — Transform raw Gemini SVG output into polished, branded SVG.
 *
 * Usage:
 *   node scripts/post-process.mjs \
 *     --input raw-slide.svg \
 *     --output slide-1.svg \
 *     --brand brand-profile.json \
 *     --slide-number 1 \
 *     --total-slides 5
 *
 * Outputs JSON to stdout: { success: true, output: "...", slideNumber: N }
 * On error: { success: false, error: "..." }
 *
 * No external dependencies — uses only Node.js builtins (fs, path).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(name) {
  const flag = `--${name}`;
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : null;
}

const inputPath = getArg('input');
const outputPath = getArg('output');
const brandPath = getArg('brand');
const slideNumber = parseInt(getArg('slide-number') || '1', 10);
const totalSlides = parseInt(getArg('total-slides') || '5', 10);

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function fail(message) {
  console.log(JSON.stringify({ success: false, error: message }));
  process.exit(1);
}

if (!inputPath) fail('Missing required argument: --input');
if (!outputPath) fail('Missing required argument: --output');
if (!brandPath) fail('Missing required argument: --brand');

if (!existsSync(inputPath)) fail(`Input file not found: ${inputPath}`);
if (!existsSync(brandPath)) fail(`Brand profile not found: ${brandPath}`);

// ---------------------------------------------------------------------------
// Read inputs
// ---------------------------------------------------------------------------

let rawSvg;
try {
  rawSvg = readFileSync(resolve(inputPath), 'utf-8');
} catch (err) {
  fail(`Failed to read input SVG: ${err.message}`);
}

let brand;
try {
  brand = JSON.parse(readFileSync(resolve(brandPath), 'utf-8'));
} catch (err) {
  fail(`Failed to read/parse brand profile: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Step 1 — Strip markdown code fences (Gemini sometimes wraps output)
// ---------------------------------------------------------------------------

let svg = rawSvg;
svg = svg.replace(/^```(?:xml|svg)?\s*\n?/m, '').replace(/\n?```\s*$/m, '');

// ---------------------------------------------------------------------------
// Step 2 — Extract inner content from <svg> wrapper if Gemini included one
// ---------------------------------------------------------------------------

const svgContentMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
const content = svgContentMatch ? svgContentMatch[1] : svg;

// Remove defs/style that Gemini may have added (we supply our own)
let cleanContent = content
  .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
  .replace(/<style>[\s\S]*?<\/style>/gi, '');

// ---------------------------------------------------------------------------
// Step 3 — Aggressively remove ALL background rectangles
// ---------------------------------------------------------------------------
// Gemini ALWAYS adds background rects despite instructions not to.
// They can be: black, dark, light, beige, cream, white — any color.
// They can be full-canvas (1080x1350) or slightly smaller (1000x1200).
// Strategy: remove ANY rect that is "large enough to be a background".

function removeBackgroundRects(svgStr) {
  const widthRe = /width=["'](\d+(?:\.\d+)?)["']/i;
  const heightRe = /height=["'](\d+(?:\.\d+)?)["']/i;
  const rxRe = /rx=["'](\d+(?:\.\d+)?)["']/i;

  svgStr = svgStr.replace(/<rect[^>]*\/?\s*>/gi, (tag) => {
    const wMatch = tag.match(widthRe);
    const hMatch = tag.match(heightRe);
    const w = wMatch ? parseFloat(wMatch[1]) : 0;
    const h = hMatch ? parseFloat(hMatch[1]) : 0;

    // Remove any rect that covers most of the canvas (background)
    // Threshold: width >= 800 AND height >= 1000 (catches Gemini's slightly-smaller bg rects)
    if (w >= 800 && h >= 1000) return '';

    // Also remove full-width rects that span the entire slide width
    // (Gemini sometimes makes slightly shorter but full-width backgrounds)
    if (w >= 1000 && h >= 800) return '';

    return tag;
  });
  return svgStr;
}

cleanContent = removeBackgroundRects(cleanContent);

// ---------------------------------------------------------------------------
// Step 3b — Escape unescaped ampersands (breaks XML parsing)
// ---------------------------------------------------------------------------

function escapeAmpersands(svgStr) {
  return svgStr.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/g, '&amp;');
}

cleanContent = escapeAmpersands(cleanContent);

// ---------------------------------------------------------------------------
// Step 3c — Fix unclosed tags (Gemini frequently forgets closing tags)
// ---------------------------------------------------------------------------

function fixUnclosedTags(svgStr) {
  const voidElements = new Set([
    'rect', 'circle', 'line', 'image', 'path', 'ellipse',
    'polygon', 'polyline', 'use', 'stop', 'br', 'hr',
    'fegaussianblur', 'fecomposite', 'fecolormatrix',
    'feoffset', 'feblend', 'feflood', 'femergenode',
    'femorphology', 'feturbulence', 'fedisplacementmap',
    'feimage', 'fetile', 'fefuncr', 'fefuncg', 'fefuncb', 'fefunca',
    'fedistantlight', 'fepointlight', 'fespotlight',
    'animate', 'animatetransform', 'animatemotion', 'set',
  ]);

  const openTags = [];
  const tagPattern = /<(\/?)([a-zA-Z]+)(?:\s[^>]*)?>|<([a-zA-Z]+)(?:\s[^>]*)?\/>/g;
  let m;
  while ((m = tagPattern.exec(svgStr)) !== null) {
    if (m[3]) continue;
    if (m[1]) {
      const tagName = m[2];
      if (openTags.length && openTags[openTags.length - 1] === tagName) openTags.pop();
    } else {
      const tagName = m[2];
      if (!voidElements.has(tagName.toLowerCase())) openTags.push(tagName);
    }
  }
  if (openTags.length > 0) {
    svgStr = svgStr.trimEnd() + '\n' + openTags.reverse().map(t => `</${t}>`).join('');
  }
  return svgStr;
}

cleanContent = fixUnclosedTags(cleanContent);

// ---------------------------------------------------------------------------
// Step 4 — Fix safe-zone violations (proportional repositioning)
// ---------------------------------------------------------------------------

function fixSafeZone(svgStr, brandProfile) {
  const SAFE_Y_MIN = brandProfile.visual?.canvas?.contentStart || 300;
  const SAFE_Y_MAX = brandProfile.visual?.canvas?.footerStart || 1100;
  const SAFE_X_MIN = brandProfile.visual?.canvas?.safeXMin || 140;
  const SAFE_X_MAX = brandProfile.visual?.canvas?.safeXMax || 920;
  const PADDING = 20;
  const SAFE_HEIGHT = SAFE_Y_MAX - SAFE_Y_MIN;
  const SAFE_WIDTH = SAFE_X_MAX - SAFE_X_MIN;

  // Collect all coordinates (skip values <= 5 — background elements)
  const yAttrs = ['y', 'y1', 'y2', 'cy'];
  const xAttrs = ['x', 'x1', 'x2', 'cx'];
  const yValues = [];
  const xValues = [];

  for (const attr of yAttrs) {
    const re = new RegExp(`\\s${attr}=["']?(\\d+(?:\\.\\d+)?)["']?`, 'gi');
    let mt;
    while ((mt = re.exec(svgStr)) !== null) {
      const v = parseFloat(mt[1]);
      if (v > 5) yValues.push(v);
    }
  }
  for (const attr of xAttrs) {
    const re = new RegExp(`\\s${attr}=["']?(\\d+(?:\\.\\d+)?)["']?`, 'gi');
    let mt;
    while ((mt = re.exec(svgStr)) !== null) {
      const v = parseFloat(mt[1]);
      if (v > 5) xValues.push(v);
    }
  }

  if (yValues.length === 0) return svgStr;

  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const contentHeight = maxY - minY;
  const minX = xValues.length ? Math.min(...xValues) : SAFE_X_MIN;
  const maxX = xValues.length ? Math.max(...xValues) : SAFE_X_MAX;
  const contentWidth = maxX - minX;

  const needsYFix = minY < SAFE_Y_MIN || maxY > SAFE_Y_MAX;
  const needsXFix = minX < SAFE_X_MIN || maxX > SAFE_X_MAX;
  if (!needsYFix && !needsXFix) return svgStr;

  // Proportional scaling if content exceeds safe area
  const availH = SAFE_HEIGHT - 2 * PADDING;
  const availW = SAFE_WIDTH - 2 * PADDING;
  const scaleY = contentHeight > availH ? availH / contentHeight : 1.0;
  const scaleX = contentWidth > availW ? availW / contentWidth : 1.0;
  const scale = Math.min(scaleY, scaleX);

  // Offset to position content within safe zone
  const xOffset = minX < SAFE_X_MIN ? SAFE_X_MIN + PADDING - minX : 0;
  const yOffset = (SAFE_Y_MIN + PADDING) - (minY * scale);

  function transformVal(val, isY) {
    if (val <= 5) return val;
    if (isY) return Math.max(SAFE_Y_MIN, Math.min(SAFE_Y_MAX - 50, (val * scale) + yOffset));
    return Math.max(SAFE_X_MIN, Math.min(SAFE_X_MAX, val + xOffset));
  }

  // Transform y-type attributes
  for (const attr of yAttrs) {
    const re = new RegExp(`(\\s)${attr}=["'](\\d+(?:\\.\\d+)?)["']`, 'gi');
    svgStr = svgStr.replace(re, (match, sp, val) => {
      const old = parseFloat(val);
      if (old <= 5) return match;
      return `${sp}${attr}="${Math.round(transformVal(old, true))}"`;
    });
  }

  // Transform x-type attributes
  for (const attr of xAttrs) {
    const re = new RegExp(`(\\s)${attr}=["'](\\d+(?:\\.\\d+)?)["']`, 'gi');
    svgStr = svgStr.replace(re, (match, sp, val) => {
      const old = parseFloat(val);
      if (old <= 5) return match;
      return `${sp}${attr}="${Math.round(transformVal(old, false))}"`;
    });
  }

  // Scale width/height (not canvas-sized ones)
  if (scale < 1.0) {
    svgStr = svgStr.replace(/(\s)(width|height)=["'](\d+(?:\.\d+)?)["']/gi, (match, sp, attr, val) => {
      const old = parseFloat(val);
      if (old >= 1000) return match;
      return `${sp}${attr}="${Math.round(old * scale)}"`;
    });
    // Scale font sizes (minimum 18px)
    svgStr = svgStr.replace(/font-size=["']?(\d+(?:\.\d+)?)(px)?["']?/gi, (match, size, px) => {
      return `font-size="${Math.max(18, Math.round(parseFloat(size) * scale))}${px || ''}"`;
    });
  }

  // Handle transform="translate(x, y)"
  svgStr = svgStr.replace(
    /transform=["']translate\(([^,)]+)(?:,\s*([^)]+))?\)["']/gi,
    (match, xStr, yStr) => {
      try {
        const oldX = parseFloat(xStr.trim());
        const oldY = parseFloat((yStr || '0').trim());
        const newX = oldX > 5 ? Math.round(oldX + xOffset) : oldX;
        const newY = oldY > 5 ? Math.round((oldY * scale) + yOffset) : oldY;
        return `transform="translate(${newX}, ${newY})"`;
      } catch { return match; }
    }
  );

  return svgStr;
}

cleanContent = fixSafeZone(cleanContent, brand);

// ---------------------------------------------------------------------------
// Step 4c — Gradient overuse reduction
// ---------------------------------------------------------------------------

function reduceGradientOveruse(svgStr, brandProfile) {
  const textColor = brandProfile.visual?.colors?.text || '#FFFFFF';
  const gradientPattern = /fill="url\(#(?:brandGradient|nodeSilver|brandGradientAlt)\)"/g;
  const matches = [...svgStr.matchAll(gradientPattern)];
  if (matches.length <= 2) return svgStr;
  // Keep first 2, replace rest with text color
  let count = 0;
  return svgStr.replace(gradientPattern, (match) => {
    count++;
    return count <= 2 ? match : `fill="${textColor}"`;
  });
}

cleanContent = reduceGradientOveruse(cleanContent, brand);

// ---------------------------------------------------------------------------
// Step 4d — ALL CAPS detection -> Title Case
// ---------------------------------------------------------------------------

function fixAllCaps(svgStr) {
  // Find text content between > and </ that has 3+ consecutive uppercase words
  return svgStr.replace(/>([^<]+)</g, (match, text) => {
    const words = text.trim().split(/\s+/);
    const upperCount = words.filter(w => w.length > 1 && w === w.toUpperCase() && /[A-Z]/.test(w)).length;
    if (upperCount >= 3 && words.length >= 3) {
      const titleCase = text.replace(/\b([A-Z])([A-Z]+)\b/g, (m, first, rest) => {
        // Keep short abbreviations like AI, CEO, ROI
        if (m.length <= 3) return m;
        return first + rest.toLowerCase();
      });
      return '>' + titleCase + '<';
    }
    return match;
  });
}

cleanContent = fixAllCaps(cleanContent);

// ---------------------------------------------------------------------------
// Step 4e — Font-family enforcement
// ---------------------------------------------------------------------------

function enforceFonts(svgStr, brandProfile) {
  const primary = brandProfile.visual?.fonts?.primary || 'Inter';
  const secondary = brandProfile.visual?.fonts?.secondary || 'Inter';
  // Replace hallucinated fonts (Arial, Helvetica, Satoshi-Black, etc.)
  // but keep the brand's chosen fonts
  return svgStr.replace(/font-family="([^"]+)"/g, (match, font) => {
    if (font === primary || font === secondary) return match;
    // Map Bold/headline fonts to primary, others to secondary
    if (/bold|headline|title/i.test(font)) return `font-family="${primary}"`;
    return `font-family="${secondary}"`;
  });
}

cleanContent = enforceFonts(cleanContent, brand);

// ---------------------------------------------------------------------------
// Step 4f — Rename nodeSilver -> brandGradient
// ---------------------------------------------------------------------------

cleanContent = cleanContent.replace(/url\(#nodeSilver\)/g, 'url(#brandGradient)');

// ---------------------------------------------------------------------------
// Step 5 — Color mixing helper
// ---------------------------------------------------------------------------

function mixColors(hex1, hex2, ratio) {
  // Normalise short hex (#abc → #aabbcc)
  const expand = (h) => {
    if (h.length === 4) {
      return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
    }
    return h;
  };
  const c1 = expand(hex1);
  const c2 = expand(hex2);

  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Step 6 — Build the final branded SVG wrapper
// ---------------------------------------------------------------------------

function buildFinalSvg(innerContent, brandProfile, slideNum) {
  const width = brandProfile.visual?.canvas?.width || 1080;
  const height = brandProfile.visual?.canvas?.height || 1350;
  const bgColor =
    brandProfile.visual?.background?.color ||
    brandProfile.visual?.colors?.primary ||
    '#1a1a1a';
  const fontPrimary = brandProfile.visual?.fonts?.primary || 'Inter';
  const fontSecondary = brandProfile.visual?.fonts?.secondary || 'Inter';

  // Gradient colours
  const gradientFrom =
    brandProfile.visual?.colors?.gradient?.from ||
    brandProfile.visual?.colors?.accent ||
    '#666666';
  const gradientTo =
    brandProfile.visual?.colors?.gradient?.to || '#FFFFFF';

  // Multi-stop chrome gradient (the key to a premium look)
  const gradientStops = brandProfile.visual?.colors?.gradient?.stops || [
    { offset: '0%', color: gradientFrom },
    { offset: '20%', color: mixColors(gradientFrom, gradientTo, 0.4) },
    { offset: '40%', color: gradientTo },
    { offset: '50%', color: gradientTo },
    { offset: '60%', color: gradientTo },
    { offset: '80%', color: mixColors(gradientFrom, gradientTo, 0.4) },
    { offset: '100%', color: gradientFrom },
  ];

  const stopsXml = gradientStops
    .map((s) => `      <stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join('\n');

  // --- Background -----------------------------------------------------------
  const bgStyle = brandProfile.visual?.background?.style || 'solid_dark';
  let backgroundXml = `  <rect width="${width}" height="${height}" fill="${bgColor}"/>`;
  let backgroundGradientDefs = '';

  // Generate gradient background if style is "gradient"
  if (bgStyle === 'gradient' || bgStyle === 'radial_glow' || bgStyle === 'diagonal_sweep') {
    const accentColor = brandProfile.visual?.colors?.accent || '#666666';
    const gradientStyle = brandProfile.visual?.background?.gradientStyle || bgStyle;

    if (gradientStyle === 'radial_glow') {
      backgroundGradientDefs = `
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0"/>
    </radialGradient>`;
      backgroundXml = [
        `  <rect width="${width}" height="${height}" fill="${bgColor}"/>`,
        `  <rect width="${width}" height="${height}" fill="url(#bgGlow)"/>`,
      ].join('\n');
    } else if (gradientStyle === 'diagonal_sweep') {
      backgroundGradientDefs = `
    <linearGradient id="bgSweep" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.08"/>
      <stop offset="50%" stop-color="${bgColor}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.05"/>
    </linearGradient>`;
      backgroundXml = [
        `  <rect width="${width}" height="${height}" fill="${bgColor}"/>`,
        `  <rect width="${width}" height="${height}" fill="url(#bgSweep)"/>`,
      ].join('\n');
    } else {
      // Default linear gradient (dark to darker)
      const darkerBg = mixColors(bgColor, '#000000', 0.4);
      backgroundGradientDefs = `
    <linearGradient id="bgLinear" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${bgColor}"/>
      <stop offset="100%" stop-color="${darkerBg}"/>
    </linearGradient>`;
      backgroundXml = `  <rect width="${width}" height="${height}" fill="url(#bgLinear)"/>`;
    }
  }

  // Custom background image overrides gradient
  const bgImage =
    slideNum === 1
      ? brandProfile.visual?.background?.heroImage
      : brandProfile.visual?.background?.contentImage;

  if (bgImage) {
    try {
      const resolvedBgPath = resolve(process.cwd(), bgImage);
      if (bgImage.endsWith('.svg')) {
        const bgSvgRaw = readFileSync(resolvedBgPath, 'utf-8');
        const bgContent = bgSvgRaw
          .replace(/<\?xml[^?]*\?>/, '')
          .replace(/<svg[^>]*>/, '')
          .replace(/<\/svg>/, '');
        backgroundXml = [
          `  <g id="background">`,
          `    <rect width="${width}" height="${height}" fill="${bgColor}"/>`,
          `    ${bgContent}`,
          `  </g>`,
        ].join('\n');
        backgroundGradientDefs = ''; // Image overrides gradient
      } else {
        const imgBuffer = readFileSync(resolvedBgPath);
        const base64 = imgBuffer.toString('base64');
        const ext = bgImage.split('.').pop().toLowerCase();
        const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
        backgroundXml = `  <image href="data:${mime};base64,${base64}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
        backgroundGradientDefs = '';
      }
    } catch {
      // Fall back to solid/gradient — already set above
    }
  }

  // --- Google Fonts import ---------------------------------------------------
  // Convert font names to Google Fonts URL format (spaces → +)
  const googleFonts = [fontPrimary, fontSecondary]
    .filter((f, i, a) => a.indexOf(f) === i) // dedupe
    .filter(f => !['Inter', 'Arial', 'Helvetica', 'sans-serif', 'serif', 'monospace'].includes(f))
    .map(f => f.replace(/\s+/g, '+'))
    .join('&amp;family=');

  const fontImport = googleFonts
    ? `@import url('https://fonts.googleapis.com/css2?family=${googleFonts}:wght@400;500;600;700;800;900&amp;display=swap');`
    : '';

  // --- Assemble -------------------------------------------------------------
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      ${fontImport}
      text {
        font-family: '${fontPrimary}', '${fontSecondary}', -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: -0.02em;
      }
    </style>
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
${stopsXml}
    </linearGradient>${backgroundGradientDefs}
  </defs>

${backgroundXml}

  <g id="content">
${innerContent}
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// Step 7 — XML validation (check the final SVG is parseable)
// ---------------------------------------------------------------------------

function validateXml(svgStr) {
  const errors = [];

  // Check basic structure
  if (!svgStr.includes('<svg')) errors.push('Missing <svg> element');
  if (!svgStr.includes('</svg>')) errors.push('Missing </svg> closing tag');

  // Check for common XML errors
  // Unmatched quotes in attributes
  const badAttr = svgStr.match(/<[^>]*=["'][^"']*(?:<|$)/gm);
  if (badAttr) errors.push(`Possible unclosed attribute quote (${badAttr.length} found)`);

  // Check tag balance for non-void elements
  const nonVoid = ['svg', 'g', 'text', 'tspan', 'defs', 'style', 'linearGradient',
    'radialGradient', 'clipPath', 'mask', 'pattern', 'filter', 'femerge',
    'fecomponenttransfer', 'marker', 'symbol', 'a', 'switch', 'foreignObject'];

  for (const tag of nonVoid) {
    const opens = (svgStr.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
    const closes = (svgStr.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    const selfClose = (svgStr.match(new RegExp(`<${tag}[^>]*/\\s*>`, 'gi')) || []).length;
    const unmatched = opens - selfClose - closes;
    if (unmatched > 0) errors.push(`Unclosed <${tag}> (${unmatched} unmatched)`);
    if (unmatched < 0) errors.push(`Extra </${tag}> (${Math.abs(unmatched)} extra)`);
  }

  // Check for invalid characters that break XML
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(svgStr)) {
    errors.push('Contains invalid XML control characters');
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Step 8 — Fallback SVG (when Gemini fails completely)
// ---------------------------------------------------------------------------

function buildFallbackSvg(brandProfile, slideNum, totalSlides, errorMsg) {
  const width = brandProfile.visual?.canvas?.width || 1080;
  const height = brandProfile.visual?.canvas?.height || 1350;
  const bgColor = brandProfile.visual?.background?.color || '#1a1a1a';
  const textColor = brandProfile.visual?.colors?.text || '#FFFFFF';
  const captionColor = brandProfile.visual?.colors?.caption || '#999999';
  const fontPrimary = brandProfile.visual?.fonts?.primary || 'Inter';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="${width / 2}" y="${height / 2 - 40}" text-anchor="middle"
        font-family="${fontPrimary}, sans-serif" font-size="48" fill="${textColor}">
    Slide ${slideNum}
  </text>
  <text x="${width / 2}" y="${height / 2 + 30}" text-anchor="middle"
        font-family="${fontPrimary}, sans-serif" font-size="24" fill="${captionColor}">
    Generation failed — please regenerate this slide
  </text>
  <text x="${width / 2}" y="${height / 2 + 70}" text-anchor="middle"
        font-family="${fontPrimary}, sans-serif" font-size="18" fill="${captionColor}" opacity="0.5">
    ${errorMsg || 'Unknown error'}
  </text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let finalSvg;

try {
  finalSvg = buildFinalSvg(cleanContent, brand, slideNumber);
} catch (err) {
  // If SVG build fails, use fallback
  finalSvg = buildFallbackSvg(brand, slideNumber, totalSlides, err.message);
}

// Validate the final SVG
const validation = validateXml(finalSvg);
if (!validation.valid) {
  // Try to fix remaining issues
  let fixed = finalSvg;

  // Remove invalid control characters
  fixed = fixed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

  // Re-validate
  const recheck = validateXml(fixed);
  if (recheck.valid) {
    finalSvg = fixed;
  }
  // If still invalid, output anyway but warn (better than nothing)
}

// Ensure output directory exists
mkdirSync(dirname(resolve(outputPath)), { recursive: true });

try {
  writeFileSync(resolve(outputPath), finalSvg);
} catch (err) {
  fail(`Failed to write output: ${err.message}`);
}

console.log(
  JSON.stringify({
    success: true,
    output: resolve(outputPath),
    slideNumber,
    totalSlides,
    validation: validation.valid ? 'passed' : { warnings: validation.errors },
  })
);
