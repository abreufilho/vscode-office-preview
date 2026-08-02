import * as vscode from 'vscode';
import { OfficeDocumentView } from './officeDocumentView';
import type { DocumentKind } from './types';

export class OfficeEditorProvider implements vscode.CustomReadonlyEditorProvider {
  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly kind: DocumentKind
  ) {}

  openCustomDocument(uri: vscode.Uri): vscode.CustomDocument {
    return { uri, dispose: () => undefined };
  }

  resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel
  ): void {
    const view = new OfficeDocumentView(
      document.uri,
      this.extensionUri,
      this.kind,
      webviewPanel
    );
    webviewPanel.onDidDispose(() => view.dispose());
  }

  static register(extensionUri: vscode.Uri, kind: DocumentKind): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      `office-preview.${kind}Editor`,
      new OfficeEditorProvider(extensionUri, kind),
      { webviewOptions: { retainContextWhenHidden: true } }
    );
  }
}
