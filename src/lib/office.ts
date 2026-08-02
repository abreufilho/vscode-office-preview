import type { DocumentKind } from '../types';

const KIND_BY_EXTENSION: Record<string, DocumentKind> = {
  '.docx': 'docx',
  '.pptx': 'pptx',
};

/** The preview kind a path maps to, or null when the extension is unknown. */
export function kindForPath(path: unknown): DocumentKind | null {
  if (typeof path !== 'string') return null;
  const match = path.toLowerCase().match(/\.[^./\\]+$/);
  if (!match) return null;
  return KIND_BY_EXTENSION[match[0]] ?? null;
}

/** Last segment of a URI path, which always uses forward slashes. */
export function baseName(path: unknown): string {
  if (typeof path !== 'string' || path === '') return '';
  return path.split('/').pop() ?? '';
}

/**
 * Picks the document to open. A command carries its URI when invoked from the
 * Explorer, and falls back to whatever the editor or the active tab holds.
 */
export function selectTargetUri<T>(
  explicitUri: T | undefined,
  activeEditorUri: T | undefined,
  activeTabInput: { uri?: T } | undefined
): T | undefined {
  return explicitUri ?? activeEditorUri ?? activeTabInput?.uri;
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}
