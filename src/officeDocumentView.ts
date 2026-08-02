import * as crypto from 'node:crypto';
import * as vscode from 'vscode';
import { baseName, bytesToBase64 } from './lib/office';
import type { DocumentKind, Theme, WebviewMessage } from './types';

const KIND_LABELS: Record<DocumentKind, string> = { docx: 'Word', pptx: 'PowerPoint' };

/** Vendored renderers, loaded by script tag before the webview entry point. */
const VENDOR_SCRIPTS: Record<DocumentKind, string[]> = {
  docx: ['jszip.min.js', 'docx-preview.min.js'],
  pptx: ['pptx-preview.umd.js'],
};

function getNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

export class OfficeDocumentView {
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly uri: vscode.Uri,
    private readonly extensionUri: vscode.Uri,
    private readonly kind: DocumentKind,
    private readonly panel: vscode.WebviewPanel
  ) {
    this.panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
    };

    this.panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => {
        if (message.type === 'ready') void this.refresh();
      },
      null,
      this.disposables
    );

    this.watchSource();
    this.panel.webview.html = this.getHtml();
  }

  private watchSource(): void {
    if (this.uri.scheme !== 'file') return;

    const pattern = new vscode.RelativePattern(
      vscode.Uri.joinPath(this.uri, '..'),
      baseName(this.uri.path)
    );
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(() => void this.refresh(), null, this.disposables);
    watcher.onDidDelete(() => this.panel.dispose(), null, this.disposables);
    this.disposables.push(watcher);
  }

  async refresh(): Promise<void> {
    try {
      const data = await vscode.workspace.fs.readFile(this.uri);
      void this.panel.webview.postMessage({
        type: 'data',
        kind: this.kind,
        base64: bytesToBase64(data),
        theme: this.getThemeKind(),
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      void this.panel.webview.postMessage({
        type: 'error',
        message: `Could not read ${baseName(this.uri.path)}: ${reason}`,
      });
    }
  }

  private getThemeKind(): Theme {
    // HighContrast is the dark high-contrast theme; the light one is
    // HighContrastLight. There is no HighContrastDark member.
    const kind = vscode.window.activeColorTheme.kind;
    const dark =
      kind === vscode.ColorThemeKind.Dark || kind === vscode.ColorThemeKind.HighContrast;
    return dark ? 'dark' : 'light';
  }

  private webviewUri(...segments: string[]): string {
    return this.panel.webview
      .asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'dist', ...segments))
      .toString();
  }

  private getHtml(): string {
    const nonce = getNonce();
    const source = this.panel.webview.cspSource;
    const csp = [
      "default-src 'none'",
      `script-src 'nonce-${nonce}'`,
      `style-src ${source} 'unsafe-inline'`,
      `img-src ${source} blob: data:`,
      `font-src ${source} blob: data:`,
    ].join('; ');

    const vendor = VENDOR_SCRIPTS[this.kind]
      .map(
        (file) => `<script nonce="${nonce}" src="${this.webviewUri('vendor', file)}"></script>`
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${this.webviewUri('webview', 'styles.css')}">
</head>
<body class="kind-${this.kind}">
  <div id="status">Loading ${KIND_LABELS[this.kind]} document…</div>
  <div id="container"></div>
${vendor}
  <script nonce="${nonce}" src="${this.webviewUri('webview', `${this.kind}.js`)}"></script>
</body>
</html>`;
  }

  dispose(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables.length = 0;
  }
}
