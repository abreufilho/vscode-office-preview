import { container, start } from './shared';

interface DocxLibrary {
  renderAsync(
    bytes: Uint8Array,
    target: HTMLElement,
    styleTarget: HTMLElement | null,
    options: Record<string, boolean>
  ): Promise<unknown>;
}

// Loaded by script tag from dist/vendor before this entry point.
declare const docx: DocxLibrary;

start((bytes) => {
  const target = container();
  target.replaceChildren();

  return docx.renderAsync(bytes, target, null, {
    inWrapper: true,
    ignoreWidth: false,
    ignoreHeight: false,
    breakPages: true,
    renderHeaders: true,
    renderFooters: true,
    renderFootnotes: true,
    renderEndnotes: true,
  });
});
