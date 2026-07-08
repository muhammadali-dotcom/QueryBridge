import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import fc from 'fast-check';

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Parse all <img ...> tags from an HTML/Markdown string.
 * Returns array of { src, alt, width } objects.
 */
export function parseImgTags(html) {
  const results = [];
  const imgRegex = /<img\s([^>]+)>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = match[1];
    const src = (attrs.match(/src=["']([^"']+)["']/) || [])[1] || '';
    const alt = (attrs.match(/alt=["']([^"']*)["']/) || [])[1] ?? null;
    const widthStr = (attrs.match(/width=["']?(\d+)["']?/) || [])[1];
    const width = widthStr ? parseInt(widthStr, 10) : null;
    results.push({ src, alt, width });
  }
  return results;
}

/**
 * Parse all <video ...> tags from an HTML/Markdown string.
 * Returns array of { src, alt, poster, attrs } objects.
 */
export function parseVideoTags(html) {
  const results = [];
  const videoRegex = /<video\s([^>]+)>/gi;
  let match;
  while ((match = videoRegex.exec(html)) !== null) {
    const attrs = match[1];
    const src = (attrs.match(/src=["']([^"']+)["']/) || [])[1] || '';
    const alt = (attrs.match(/alt=["']([^"']*)["']/) || [])[1] ?? null;
    const poster = (attrs.match(/poster=["']([^"']+)["']/) || [])[1] || '';
    results.push({ src, alt, poster, attrs });
  }
  return results;
}

/**
 * Extract only the Demo section (between ## 🎬 Demo and the next ## heading).
 */
export function demoSection(readmeText) {
  const start = readmeText.indexOf('## 🎬 Demo');
  if (start === -1) return '';
  const rest = readmeText.slice(start + '## 🎬 Demo'.length);
  const nextH2 = rest.search(/\n## /);
  return nextH2 === -1 ? rest : rest.slice(0, nextH2);
}

// ─── README fixture ──────────────────────────────────────────────────────────

let readmeContent = '';

beforeAll(() => {
  const readmePath = path.join(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  }
});

// ─── property tests (5.2 – 5.5 added in next tasks) ────────────────────────

describe('README property tests', () => {
  it('helpers are importable', () => {
    expect(typeof parseImgTags).toBe('function');
    expect(typeof parseVideoTags).toBe('function');
    expect(typeof demoSection).toBe('function');
  });
});

// ─── unit / example tests (5.6) ─────────────────────────────────────────────

describe('README structural invariants', () => {
  it('contains ## 🎬 Demo heading', () => {
    expect(readmeContent).toContain('## 🎬 Demo');
  });

  it('## 🎬 Demo appears before ## 🔄 How It Works (if present)', () => {
    const demoIdx = readmeContent.indexOf('## 🎬 Demo');
    const howIdx = readmeContent.indexOf('## 🔄 How It Works');
    if (demoIdx === -1 || howIdx === -1) return; // skip if sections not yet present
    expect(demoIdx).toBeLessThan(howIdx);
  });

  it('<video> tag has autoplay, loop, muted, playsinline attributes', () => {
    const section = demoSection(readmeContent);
    expect(section).toMatch(/autoplay/);
    expect(section).toMatch(/loop/);
    expect(section).toMatch(/muted/);
    expect(section).toMatch(/playsinline/);
  });

  it('<video> tag poster points to step-1-landing.png', () => {
    const section = demoSection(readmeContent);
    expect(section).toMatch(/poster=["']docs\/media\/step-1-landing\.png["']/);
  });

  it('contains ### Updating Demo Media sub-section', () => {
    expect(readmeContent).toContain('### Updating Demo Media');
  });

  it('Updating Demo Media section mentions all four step filenames', () => {
    const updateIdx = readmeContent.indexOf('### Updating Demo Media');
    expect(updateIdx).toBeGreaterThan(-1);
    const updateSection = readmeContent.slice(updateIdx);
    expect(updateSection).toMatch(/step-1-landing/);
    expect(updateSection).toMatch(/step-2-input/);
    expect(updateSection).toMatch(/step-3-sql-preview/);
    expect(updateSection).toMatch(/step-4-results/);
  });

  it('contains fallback Markdown link to demo.mp4', () => {
    const section = demoSection(readmeContent);
    expect(section).toMatch(/demo\.mp4/);
    expect(section).toMatch(/\[.*\]\(.*demo\.mp4\)/);
  });

  it('contains workflow description paragraph below the video embed', () => {
    const section = demoSection(readmeContent);
    // Must have some descriptive text (paragraph) after the video tag
    expect(section).toMatch(/<\/video>/);
    const afterVideo = section.slice(section.indexOf('</video>') + '</video>'.length);
    // There must be a non-trivial text paragraph (at least 50 chars of non-tag text)
    const textOnly = afterVideo.replace(/<[^>]+>/g, '').trim();
    expect(textOnly.length).toBeGreaterThan(50);
  });

  it('all img tags in demo section have non-empty alt attributes', () => {
    const section = demoSection(readmeContent);
    const imgs = parseImgTags(section);
    // Only check if demo section exists and has images
    if (imgs.length > 0) {
      for (const img of imgs) {
        expect(img.alt).not.toBeNull();
        expect(img.alt.trim()).not.toBe('');
      }
    }
  });

  it('all img tags in demo section have width <= 800', () => {
    const section = demoSection(readmeContent);
    const imgs = parseImgTags(section);
    for (const img of imgs) {
      if (img.width !== null) {
        expect(img.width).toBeGreaterThan(0);
        expect(img.width).toBeLessThanOrEqual(800);
      }
    }
  });

  it('screenshot img src paths follow naming convention in demo section', () => {
    const section = demoSection(readmeContent);
    const imgs = parseImgTags(section);
    const convention = /^docs\/media\/step-[1-4]-(landing|input|sql-preview|results)\.png$/;
    for (const img of imgs) {
      expect(img.src).toMatch(convention);
    }
  });
});
