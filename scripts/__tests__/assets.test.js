import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MEDIA_DIR = path.join(process.cwd(), 'docs', 'media');
const PNGS = [
  'step-1-landing.png',
  'step-2-input.png',
  'step-3-sql-preview.png',
  'step-4-results.png',
];
const MAX_PNG_BYTES = 512_000;   // 500 KB
const MAX_MP4_BYTES = 10_485_760; // 10 MB

describe('Media asset smoke tests', () => {
  it('docs/media/ directory exists', () => {
    expect(fs.existsSync(MEDIA_DIR)).toBe(true);
  });

  for (const png of PNGS) {
    it(`${png} exists`, () => {
      expect(fs.existsSync(path.join(MEDIA_DIR, png))).toBe(true);
    });

    it(`${png} is ≤ 500 KB`, () => {
      const size = fs.statSync(path.join(MEDIA_DIR, png)).size;
      expect(size).toBeLessThanOrEqual(MAX_PNG_BYTES);
    });
  }

  it('demo.mp4 exists', () => {
    expect(fs.existsSync(path.join(MEDIA_DIR, 'demo.mp4'))).toBe(true);
  });

  it('demo.mp4 is ≤ 10 MB', () => {
    const size = fs.statSync(path.join(MEDIA_DIR, 'demo.mp4')).size;
    expect(size).toBeLessThanOrEqual(MAX_MP4_BYTES);
  });
});
