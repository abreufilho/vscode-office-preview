import { container, start } from './shared';

interface PptxPreviewer {
  preview(buffer: ArrayBufferLike): unknown;
}

interface PptxLibrary {
  init(target: HTMLElement, options: { width: number; height: number }): PptxPreviewer;
}

// Loaded by script tag from dist/vendor before this entry point.
declare const pptxPreview: PptxLibrary;

const MIN_WIDTH = 320;
const MAX_WIDTH = 1280;
const DEFAULT_WIDTH = 960;
const SLIDE_RATIO = 0.5625;

start(async (bytes) => {
  const target = container();
  target.replaceChildren();

  const width = Math.max(MIN_WIDTH, Math.min(target.clientWidth || DEFAULT_WIDTH, MAX_WIDTH));
  const previewer = pptxPreview.init(target, {
    width,
    height: Math.round(width * SLIDE_RATIO),
  });

  return previewer.preview(bytes.buffer);
});
