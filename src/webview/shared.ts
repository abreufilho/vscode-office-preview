import type { HostMessage, Theme, WebviewMessage } from '../types';

interface VsCodeApi {
  postMessage(message: WebviewMessage): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

/** Renders the document bytes into the container. Each kind supplies its own. */
export type Renderer = (bytes: Uint8Array) => Promise<unknown>;

function requireElement(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) {
    throw new Error(`missing element: ${id}`);
  }
  return found;
}

export function container(): HTMLElement {
  return requireElement('container');
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function setStatus(text: string): void {
  const status = requireElement('status');
  status.textContent = text;
  status.style.display = text ? 'block' : 'none';
}

function applyTheme(theme: Theme): void {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  document.body.classList.toggle('theme-light', theme !== 'dark');
}

/**
 * Wires the webview to the host: waits for bytes, hands them to the renderer,
 * and reports failures as status text rather than markup.
 */
export function start(render: Renderer): void {
  const vscode = acquireVsCodeApi();

  window.addEventListener('message', (event: MessageEvent<HostMessage>) => {
    const message = event.data;
    if (!message) return;

    if (message.type === 'error') {
      setStatus(message.message);
      container().replaceChildren();
      return;
    }

    if (message.type !== 'data') return;

    applyTheme(message.theme);
    render(decodeBase64(message.base64))
      .then(() => setStatus(''))
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : String(error);
        setStatus(`Render failed: ${reason}`);
      });
  });

  window.addEventListener('load', () => vscode.postMessage({ type: 'ready' }));
}
